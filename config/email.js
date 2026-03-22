// Simple email mock - no actual sending
const sendEmail = async (options) => {
  console.log('📧 [EMAIL MOCK] Would send email to:', options.to);
  console.log('   Subject:', options.subject);
  console.log('   Body preview:', options.html?.substring(0, 200));
  return { messageId: 'mock-' + Date.now() };
};

// Email templates (kept for reference but not used)
const emailTemplates = {
  contactAutoReply: (name, message) => ({
    subject: 'Thank you for contacting WellRoot Africa',
    html: `...`
  }),
  
  adminContactNotification: (contact) => ({
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `...`
  }),
  
  donationReceipt: (donation) => ({
    subject: `Donation Receipt - WellRoot Africa`,
    html: `...`
  }),
  
  newsletterWelcome: (name) => ({
    subject: 'Welcome to WellRoot Africa Newsletter!',
    html: `...`
  })
};

module.exports = { sendEmail, emailTemplates };