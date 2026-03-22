const express = require('express');
const router = express.Router();
const {
  getStories,
  getFeaturedStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory
} = require('../controllers/storyController');
const { protect, adminOrEditor } = require('../middleware/auth');

// Public routes
router.get('/', getStories);
router.get('/featured', getFeaturedStories);
router.get('/:slug', getStoryBySlug);

// Protected routes (Admin or Editor only)
router.post('/', protect, adminOrEditor, createStory);
router.put('/:id', protect, adminOrEditor, updateStory);
router.delete('/:id', protect, adminOrEditor, deleteStory);

module.exports = router;