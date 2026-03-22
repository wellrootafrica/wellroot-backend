const Donation = require('../models/Donation');
const { fetchLiveRates } = require('../services/exchangeRates');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private (Admin only)
const getAllDonations = async (req, res) => {
  try {
    const { status, donationType, startDate, endDate } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (donationType) filter.donationType = donationType;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const donations = await Donation.find(filter).sort({ createdAt: -1 });

    // Fetch live rates once
    const rates = await fetchLiveRates();
    
    // Calculate totals by currency and USD equivalent
    const totalsByCurrency = {};
    let usdTotal = 0;
    
    // Process each donation
    for (const donation of donations) {
      if (donation.status === 'success') {
        // Store original currency total
        if (!totalsByCurrency[donation.currency]) {
          totalsByCurrency[donation.currency] = 0;
        }
        totalsByCurrency[donation.currency] += donation.amount;
        
        // Convert to USD using live rate
        let usdValue;
        if (donation.currency === 'USD') {
          usdValue = donation.amount;
        } else {
          const rate = rates[donation.currency];
          if (rate) {
            usdValue = donation.amount / rate;
          } else {
            usdValue = donation.usdEquivalent || donation.amount;
          }
        }
        usdTotal += usdValue;
      }
    }

    const successfulCount = donations.filter(d => d.status === 'success').length;
    const pendingCount = donations.filter(d => d.status === 'pending').length;

    console.log('=== DONATION STATS ===');
    console.log('Totals by currency:', totalsByCurrency);
    console.log(`Total USD: $${usdTotal.toFixed(2)}`);
    console.log('===================');

    res.status(200).json({
      success: true,
      count: donations.length,
      stats: {
        totalAmount: parseFloat(usdTotal.toFixed(2)),
        totalsByCurrency,
        rates: {
          GHS: rates.GHS,
          NGN: rates.NGN,
          EUR: rates.EUR,
          GBP: rates.GBP
        },
        successfulCount,
        pendingCount,
        totalDonations: donations.length
      },
      data: donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private (Admin only)
const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
// @access  Private (Admin only)
const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    console.log(`Updating donation ${req.params.id} to status: ${status}`);

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, processedAt: status === 'success' ? new Date() : undefined },
      { new: true, runValidators: true }
    );

    if (!donation) {
      console.log(`Donation not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Log status change (PayStack handles email receipts)
    console.log(`Donation ${donation._id} status updated to ${status} (email handled by PayStack)`);

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new donation (from payment callback)
// @route   POST /api/donations
// @access  Private (Admin only)
const createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    
    console.log(`New donation created: ${donation._id} - ${donation.amount} ${donation.currency} from ${donation.donorName}`);
    
    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Admin only)
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    console.log(`Donation ${donation._id} deleted`);
    
    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Resend donation receipt (placeholder - PayStack handles this)
// @route   POST /api/donations/:id/resend-receipt
// @access  Private (Admin only)
const resendReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    if (donation.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Cannot resend receipt for pending donation'
      });
    }
    
    // PayStack handles donation receipts - just log
    console.log(`Receipt requested for donation ${donation._id} - PayStack handles email receipts`);
    
    res.status(200).json({
      success: true,
      message: 'Donation receipt can be downloaded from PayStack. Check your email for receipt from PayStack.'
    });
  } catch (error) {
    console.error('Error resending receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllDonations,
  getDonation,
  updateDonationStatus,
  createDonation,
  deleteDonation,
  resendReceipt
};