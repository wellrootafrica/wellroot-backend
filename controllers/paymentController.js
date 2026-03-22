const Paystack = require('paystack-api');
const Donation = require('../models/Donation');
const axios = require('axios');

// Helper function to get live exchange rate
const getLiveExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    // Use exchangerate.host API (free, no key required)
    const response = await axios.get(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`);
    if (response.data && response.data.result) {
      return response.data.result;
    }
    throw new Error('Invalid response from exchange rate API');
  } catch (error) {
    console.error(`Error fetching exchange rate for ${fromCurrency} to ${toCurrency}:`, error.message);
    // Fallback to approximate rates
    const fallbackRates = {
      USD: { GHS: 14.5, NGN: 1500 },
      EUR: { GHS: 15.8, NGN: 1600 },
      GBP: { GHS: 18.5, NGN: 1900 },
      GHS: { USD: 0.069, NGN: 103 }
    };
    if (toCurrency === 'GHS') return fallbackRates[fromCurrency]?.GHS || 14.5;
    if (toCurrency === 'NGN') return fallbackRates[fromCurrency]?.NGN || 1500;
    return 1;
  }
};

// Initialize PayStack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize PayStack payment
// @route   POST /api/payments/initialize
// @access  Public
const initializePayment = async (req, res) => {
  try {
    console.log('=== PAYMENT INITIALIZATION STARTED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      amount,
      currency,
      usdEquivalent,
      donorName,
      donorEmail,
      donorPhone,
      donationType,
      message,
      taxReceipt,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }
    
    if (!donorName || !donorEmail) {
      return res.status(400).json({
        success: false,
        message: 'Donor name and email are required'
      });
    }

    console.log(`Processing donation: ${amount} ${currency} from ${donorName} (${donorEmail})`);

    // Determine PayStack currency based on original currency or payment method
    let paystackCurrency;
    let paystackAmount;
    let exchangeRate;
    
    if (currency === 'GHS') {
      // If donating in GHS, pay in GHS
      paystackCurrency = 'GHS';
      paystackAmount = Math.round(amount * 100); // Convert to pesewas (smallest unit)
      exchangeRate = 1;
      console.log(`Amount in GHS: ${amount} GHS (${paystackAmount} pesewas)`);
    } else if (currency === 'NGN') {
      // If donating in NGN, pay in NGN
      paystackCurrency = 'NGN';
      paystackAmount = Math.round(amount * 100); // Convert to kobo
      exchangeRate = 1;
      console.log(`Amount in NGN: ${amount} NGN (${paystackAmount} kobo)`);
    } else if (currency === 'USD') {
      // Convert USD to GHS for PayStack (since organization is in Ghana)
      paystackCurrency = 'GHS';
      exchangeRate = await getLiveExchangeRate('USD', 'GHS');
      const ghsAmount = amount * exchangeRate;
      paystackAmount = Math.round(ghsAmount * 100); // Convert to pesewas
      console.log(`Converted ${amount} USD to ${ghsAmount} GHS (rate: ${exchangeRate})`);
    } else if (currency === 'EUR') {
      // Convert EUR to GHS
      paystackCurrency = 'GHS';
      exchangeRate = await getLiveExchangeRate('EUR', 'GHS');
      const ghsAmount = amount * exchangeRate;
      paystackAmount = Math.round(ghsAmount * 100);
      console.log(`Converted ${amount} EUR to ${ghsAmount} GHS (rate: ${exchangeRate})`);
    } else if (currency === 'GBP') {
      // Convert GBP to GHS
      paystackCurrency = 'GHS';
      exchangeRate = await getLiveExchangeRate('GBP', 'GHS');
      const ghsAmount = amount * exchangeRate;
      paystackAmount = Math.round(ghsAmount * 100);
      console.log(`Converted ${amount} GBP to ${ghsAmount} GHS (rate: ${exchangeRate})`);
    } else {
      // Default to GHS
      paystackCurrency = 'GHS';
      exchangeRate = await getLiveExchangeRate(currency, 'GHS');
      const ghsAmount = amount * exchangeRate;
      paystackAmount = Math.round(ghsAmount * 100);
      console.log(`Converted ${amount} ${currency} to ${ghsAmount} GHS (rate: ${exchangeRate})`);
    }

    console.log(`PayStack amount: ${paystackAmount / 100} ${paystackCurrency}`);

    // Create donation record
    const donation = await Donation.create({
      amount: amount,
      currency: currency,
      usdEquivalent: usdEquivalent || (currency === 'USD' ? amount : await getLiveExchangeRate(currency, 'USD') * amount),
      donorName,
      donorEmail,
      donorPhone,
      donationType: donationType || 'one-time',
      paymentMethod: paymentMethod || 'card',
      paymentGateway: 'paystack',
      message,
      taxReceipt: taxReceipt || false,
      status: 'pending'
    });

    console.log(`Donation created with ID: ${donation._id}`);

    // Prepare PayStack request
    const paystackData = {
      amount: paystackAmount,
      email: donorEmail,
      currency: paystackCurrency, // Set currency for PayStack
      reference: donation._id.toString(),
      metadata: {
        donation_id: donation._id.toString(),
        donor_name: donorName,
        donation_type: donationType,
        original_amount: amount,
        original_currency: currency,
        exchange_rate: exchangeRate,
        payment_method: paymentMethod
      },
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/thank-you`
    };

    // Add mobile money specific fields if applicable
    if (paymentMethod === 'mobile_money') {
      if (currency === 'GHS') {
        paystackData.mobile_money = {
          provider: 'mtn',
          phone: donorPhone
        };
      } else if (currency === 'NGN') {
        paystackData.mobile_money = {
          provider: 'mtn',
          phone: donorPhone
        };
      }
    }

    console.log('Calling PayStack API with:', {
      amount: paystackAmount / 100,
      currency: paystackCurrency,
      email: donorEmail,
      reference: donation._id.toString(),
      paymentMethod: paymentMethod,
      exchangeRate: exchangeRate
    });
    
    const response = await paystack.transaction.initialize(paystackData);

    console.log('PayStack response status:', response.status);

    if (response.status) {
      console.log('Payment initialization successful!');
      console.log('Authorization URL:', response.data.authorization_url);
      res.status(200).json({
        success: true,
        data: {
          authorization_url: response.data.authorization_url,
          reference: response.data.reference,
          donation_id: donation._id
        }
      });
    } else {
      console.log('PayStack returned error:', response.message);
      throw new Error(response.message || 'Payment initialization failed');
    }
  } catch (error) {
    console.error('Error initializing payment:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment initialization failed',
      error: error.response?.data || error.message
    });
  }
};

// @desc    Verify PayStack payment
// @route   GET /api/payments/verify/:reference
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    console.log(`Verifying payment with reference: ${reference}`);

    // Verify transaction with PayStack
    const response = await paystack.transaction.verify(reference);

    console.log('Verification response status:', response.status);

    if (response.status && response.data.status === 'success') {
      // Find and update donation
      const donation = await Donation.findById(response.data.metadata.donation_id);
      
      if (donation) {
        donation.status = 'success';
        donation.transactionId = response.data.id;
        donation.processedAt = new Date();
        await donation.save();
        console.log(`✅ Donation ${donation._id} marked as success`);
      } else {
        console.log(`⚠️ Donation not found for ID: ${response.data.metadata.donation_id}`);
      }

      res.status(200).json({
        success: true,
        data: {
          donation,
          transaction: response.data
        }
      });
    } else {
      console.log('Payment verification failed:', response.data);
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: response.data
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
};

// @desc    Webhook for PayStack events
// @route   POST /api/payments/webhook
// @access  Public (should verify signature in production)
const paymentWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('Webhook received:', event.event);

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      
      // Update donation status
      const donation = await Donation.findById(metadata.donation_id);
      if (donation) {
        donation.status = 'success';
        donation.transactionId = event.data.id;
        donation.processedAt = new Date();
        await donation.save();
        console.log(`✅ Donation ${donation._id} completed successfully via webhook`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  paymentWebhook
};