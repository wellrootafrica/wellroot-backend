const axios = require('axios');

// Cache configuration
let cachedRates = null;
let cacheTimestamp = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Fetch live exchange rates from multiple fallback APIs
 * @returns {Promise<Object>} - Exchange rates object
 */
const fetchLiveRates = async () => {
  try {
    // Check cache first
    if (cachedRates && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      console.log('Using cached exchange rates (age: ' + Math.round((Date.now() - cacheTimestamp) / 60000) + ' minutes)');
      return cachedRates;
    }

    console.log('Fetching live exchange rates for backend...');
    
    // Try multiple APIs in sequence
    const apis = [
      'https://api.exchangerate-api.com/v4/latest/USD',
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      'https://api.exchangerate.host/latest?base=USD'
    ];
    
    let rates = null;
    
    for (const apiUrl of apis) {
      try {
        console.log(`Trying API: ${apiUrl}`);
        const response = await axios.get(apiUrl, { timeout: 5000 });
        
        // Parse different API response formats
        if (apiUrl.includes('exchangerate-api.com')) {
          if (response.data && response.data.rates) {
            rates = response.data.rates;
            console.log('✅ Using exchangerate-api.com');
            break;
          }
        } else if (apiUrl.includes('currency-api')) {
          if (response.data && response.data.usd) {
            rates = response.data.usd;
            console.log('✅ Using currency-api');
            break;
          }
        } else if (apiUrl.includes('exchangerate.host')) {
          if (response.data && response.data.rates) {
            rates = response.data.rates;
            console.log('✅ Using exchangerate.host');
            break;
          }
        }
      } catch (err) {
        console.log(`API failed: ${err.message}`);
        continue;
      }
    }
    
    if (rates) {
      // Ensure we have all needed currencies
      const neededCurrencies = ['GHS', 'NGN', 'EUR', 'GBP', 'ZAR', 'KES', 'UGX', 'TZS', 'XOF'];
      neededCurrencies.forEach(currency => {
        if (!rates[currency]) {
          console.log(`⚠️ Missing rate for ${currency}, using fallback`);
          // Add fallback rates
          const fallbackRates = {
            GHS: 14.5,
            NGN: 1500,
            EUR: 0.92,
            GBP: 0.79,
            ZAR: 18.5,
            KES: 145,
            UGX: 3800,
            TZS: 2600,
            XOF: 615
          };
          rates[currency] = fallbackRates[currency];
        }
      });
      
      cachedRates = rates;
      cacheTimestamp = Date.now();
      console.log('✅ Exchange rates updated successfully:');
      console.log(`   USD to GHS: ${rates.GHS}`);
      console.log(`   USD to NGN: ${rates.NGN}`);
      console.log(`   USD to EUR: ${rates.EUR}`);
      console.log(`   USD to GBP: ${rates.GBP}`);
      return cachedRates;
    }
    
    throw new Error('All APIs failed');
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error.message);
    console.log('Using fallback rates');
    // Return fallback rates
    const fallbackRates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      GHS: 14.5,
      NGN: 1500,
      ZAR: 18.50,
      KES: 145,
      UGX: 3800,
      TZS: 2600,
      XOF: 615
    };
    cachedRates = fallbackRates;
    cacheTimestamp = Date.now();
    return fallbackRates;
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency
 * @param {string} to - Target currency
 * @returns {Promise<number>} - Converted amount
 */
const convertCurrency = async (amount, from, to) => {
  if (from === to) return amount;
  
  const rates = await fetchLiveRates();
  
  // Convert to USD first if needed
  let usdAmount;
  if (from === 'USD') {
    usdAmount = amount;
  } else {
    // Get rate from source to USD
    const rateToUSD = 1 / rates[from];
    usdAmount = amount * rateToUSD;
  }
  
  // Convert from USD to target
  if (to === 'USD') {
    return usdAmount;
  } else {
    return usdAmount * rates[to];
  }
};

/**
 * Get exchange rate between two currencies
 * @param {string} from - Source currency
 * @param {string} to - Target currency
 * @returns {Promise<number>} - Exchange rate
 */
const getExchangeRate = async (from, to) => {
  if (from === to) return 1;
  
  const rates = await fetchLiveRates();
  
  if (from === 'USD') {
    return rates[to];
  } else if (to === 'USD') {
    return 1 / rates[from];
  } else {
    // Convert via USD
    const usdRate = 1 / rates[from];
    return usdRate * rates[to];
  }
};

module.exports = {
  fetchLiveRates,
  convertCurrency,
  getExchangeRate
};