const express = require('express');
const router = express.Router();
const {
  submitContact,
  subscribeNewsletter,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect, adminOrEditor } = require('../middleware/auth');

// Public routes
router.post('/', submitContact);
router.post('/newsletter', subscribeNewsletter);

// Protected routes (Admin or Editor only)
router.get('/', protect, adminOrEditor, getContacts);
router.get('/:id', protect, adminOrEditor, getContact);
router.put('/:id/status', protect, adminOrEditor, updateContactStatus);
router.delete('/:id', protect, adminOrEditor, deleteContact);

module.exports = router;