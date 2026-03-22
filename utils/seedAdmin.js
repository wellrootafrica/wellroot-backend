const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@wellrootafrica.org' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`   Email: admin@wellrootafrica.org`);
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@wellrootafrica.org',
      password: 'Admin123!',
      role: 'admin',
      isActive: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@wellrootafrica.org');
    console.log('   Password: Admin123!');
    console.log('   ⚠️  Please change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config();
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      seedAdmin();
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { seedAdmin };