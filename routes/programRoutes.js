const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgramBySlug,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');
const { protect, adminOrEditor } = require('../middleware/auth');

// Public routes
router.get('/', getPrograms);
router.get('/:slug', getProgramBySlug);

// Protected routes (Admin or Editor only)
router.post('/', protect, adminOrEditor, createProgram);
router.put('/:id', protect, adminOrEditor, updateProgram);
router.delete('/:id', protect, adminOrEditor, deleteProgram);

module.exports = router;