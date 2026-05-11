// Run this once to create the default admin account
// Usage: node seed.js

const bcrypt = require('bcryptjs');
const db = require('./db');

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);

    await db.query(
      `INSERT INTO users (username, email, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username = username`,
      ['admin', 'admin@smartwash.edu', adminPass, 'admin', 'System Admin']
    );

    console.log('✅ Admin account created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
