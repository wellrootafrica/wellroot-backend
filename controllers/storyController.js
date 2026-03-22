const Story = require('../models/Story');

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
};

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }
    
    const stories = await Story.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured stories
// @route   GET /api/stories/featured
// @access  Public
const getFeaturedStories = async (req, res) => {
  try {
    const stories = await Story.find({ featured: true, status: 'published' })
      .limit(3)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single story by slug
// @route   GET /api/stories/:slug
// @access  Public
const getStoryBySlug = async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new story
// @route   POST /api/stories
// @access  Private (Admin only)
const createStory = async (req, res) => {
  try {
    const storyData = req.body;
    
    // Generate slug from title
    if (storyData.title) {
      storyData.slug = generateSlug(storyData.title);
    }
    
    const story = await Story.create(storyData);
    
    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Error creating story:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Story with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private (Admin only)
const updateStory = async (req, res) => {
  try {
    const updateData = req.body;
    
    // If title is being updated, update slug as well
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }
    
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private (Admin only)
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getStories,
  getFeaturedStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory
};