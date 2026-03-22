const express = require('express');
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  paymentWebhook
} = require('../controllers/paymentController');

// Test endpoint to verify CORS is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Payment API is working!',
    timestamp: new Date().toISOString()
  });
});

router.post('/initialize', initializePayment);
router.get('/verify/:reference', verifyPayment);
router.post('/webhook', paymentWebhook);

module.exports = router;