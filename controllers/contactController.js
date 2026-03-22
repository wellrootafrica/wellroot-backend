const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, type } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject and message'
      });
    }
    
    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      type: type || 'contact'
    });
    
    // Log submission (no email sending)
    console.log(`📝 New contact submission from ${name} (${email}) - Type: ${type || 'contact'}`);
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/contact/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if already subscribed
    const existingSubscriber = await Contact.findOne({ email, type: 'newsletter' });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }
    
    // Create contact record as newsletter subscription
    const subscription = await Contact.create({
      name: name || 'Newsletter Subscriber',
      email,
      subject: 'Newsletter Subscription',
      message: 'Subscribed to newsletter',
      type: 'newsletter',
      status: 'new'
    });
    
    console.log(`📧 [NEWSLETTER] New subscriber: ${email}`);
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin routes

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (Admin only)
const getContacts = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private (Admin only)
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    console.log(`Contact ${contact._id} status updated to ${status}`);
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    console.log(`Contact ${contact._id} deleted`);
    
    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitContact,
  subscribeNewsletter,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact
};