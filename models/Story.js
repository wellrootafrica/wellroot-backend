const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
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
  category: {
    type: String,
    enum: ['education', 'water', 'nutrition', 'health', 'empowerment', 'all'],
    required: true,
    default: 'all'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    maxlength: [300, 'Summary cannot exceed 300 characters']
  },
  fullStory: {
    type: String,
    required: [true, 'Full story is required']
  },
  impact: {
    children: { type: Number, default: 0 },
    teachers: { type: Number, default: 0 },
    communities: { type: Number, default: 0 },
    beneficiaries: { type: Number, default: 0 },
    schools: { type: Number, default: 0 },
    meals: { type: Number, default: 0 },
    clinics: { type: Number, default: 0 },
    kits: { type: Number, default: 0 },
    boreholes: { type: Number, default: 0 },
    latrines: { type: Number, default: 0 },
    families: { type: Number, default: 0 },
    women: { type: Number, default: 0 }
  },
  images: [{
    type: String
  }],
  testimonial: {
    quote: { type: String },
    name: { type: String },
    role: { type: String }
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);