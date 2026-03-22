const express = require('express');
const router = express.Router();
const { sendEmail, emailTemplates } = require('../config/email');

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    await sendEmail({
      to: email,
      subject: 'Test Email from WellRoot Africa',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e5631; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>WellRoot Africa</h1>
            </div>
            <div class="content">
              <h2>✅ Test Email Successful!</h2>
              <p>If you received this email, your SendGrid configuration is working correctly!</p>
              <p>This is a test email from WellRoot Africa.</p>
              <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
              <p>Your email system is now ready for production.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WellRoot Africa</p>
              <p>Dansoman, Accra, Ghana</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    res.json({
      success: true,
      message: `Test email sent to ${email}`
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

module.exports = router;