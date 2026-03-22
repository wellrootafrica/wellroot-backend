const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Subtitle cannot exceed 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required']
  },
  heroImage: {
    type: String,
    default: ''
  },
  gallery: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['education', 'nutrition', 'health', 'water', 'empowerment', 'all'],
    required: true,
    default: 'all'
  },
  impact: {
    beneficiaries: {
      type: Number,
      default: 0
    },
    locations: {
      type: Number,
      default: 0
    },
    yearStarted: {
      type: Number,
      default: 2025
    }
  },
  keyComponents: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', programSchema);