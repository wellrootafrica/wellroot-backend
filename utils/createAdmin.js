const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: 'admin@wellrootafrica.org' });
    console.log('🗑️  Deleted existing admin');

    // Hash password directly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('Hashed password created');

    // Create new admin with hashed password
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

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();