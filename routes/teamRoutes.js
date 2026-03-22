const express = require('express');
const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all team members - coming soon' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get team member ${req.params.id} - coming soon` });
});

// Admin routes (protected)
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create team member - coming soon' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update team member ${req.params.id} - coming soon` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete team member ${req.params.id} - coming soon` });
});

module.exports = router;