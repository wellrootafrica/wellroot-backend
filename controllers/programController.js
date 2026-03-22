const Program = require('../models/Program');

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
};

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
const getPrograms = async (req, res) => {
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
    }
    
    const programs = await Program.find(filter).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single program by slug
// @route   GET /api/programs/:slug
// @access  Public
const getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new program
// @route   POST /api/programs
// @access  Private (Admin only)
const createProgram = async (req, res) => {
  try {
    const programData = req.body;
    
    // Generate slug from title
    if (programData.title) {
      programData.slug = generateSlug(programData.title);
    }
    
    const program = await Program.create(programData);
    
    res.status(201).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error creating program:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Program with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private (Admin only)
const updateProgram = async (req, res) => {
  try {
    const updateData = req.body;
    
    // If title is being updated, update slug as well
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }
    
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private (Admin only)
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getPrograms,
  getProgramBySlug,
  createProgram,
  updateProgram,
  deleteProgram
};