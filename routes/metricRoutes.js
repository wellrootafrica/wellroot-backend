const express = require('express');
const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all impact metrics - coming soon' });
});

// Admin routes (protected)
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update metric ${req.params.id} - coming soon` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create new metric - coming soon' });
});

module.exports = router;