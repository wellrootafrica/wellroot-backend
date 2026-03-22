const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updateUser,
  changePassword
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);  // Add this line

// Admin only routes
router.post('/register', protect, admin, register);
router.put('/:id', protect, admin, updateUser);

module.exports = router;