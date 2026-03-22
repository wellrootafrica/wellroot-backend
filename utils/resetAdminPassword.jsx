const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Hash the new password using the static method
    const hashedPassword = await User.hashPassword('admin123');

    // Update admin password
    const result = await User.updateOne(
      { email: 'admin@wellrootafrica.org' },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('   Email: admin@wellrootafrica.org');
      console.log('   Password: admin123');
    } else {
      console.log('⚠️ Admin user not found. Creating new admin...');
      
      // Create new admin if not exists
      const admin = new User({
        name: 'Admin User',
        email: 'admin@wellrootafrica.org',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      await admin.save();
      console.log('✅ Admin created successfully!');
      console.log('   Email: admin@wellrootafrica.org');
      console.log('   Password: admin123');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();