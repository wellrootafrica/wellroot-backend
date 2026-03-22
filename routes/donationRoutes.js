const express = require('express');
const router = express.Router();
const {
  getAllDonations,
  getDonation,
  updateDonationStatus,
  createDonation,
  deleteDonation,
  resendReceipt
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth');

// Protected admin routes
router.get('/', protect, admin, getAllDonations);
router.get('/:id', protect, admin, getDonation);
router.post('/', protect, admin, createDonation);
router.put('/:id/status', protect, admin, updateDonationStatus);
router.post('/:id/resend-receipt', protect, admin, resendReceipt);
router.delete('/:id', protect, admin, deleteDonation);

module.exports = router;