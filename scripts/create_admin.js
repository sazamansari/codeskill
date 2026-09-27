const path = require('path');
const mongoose = require(path.join(__dirname, '../backend-nestjs/node_modules/mongoose'));
const bcrypt = require(path.join(__dirname, '../backend-nestjs/node_modules/bcryptjs'));
require('dotenv').config({ path: path.join(__dirname, '../backend-nestjs/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mdshadabazamansari:123123123123@cluster0.gwcfd5x.mongodb.net/codeskill?retryWrites=true&w=majority';

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully!');

  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, select: true },
    role: String,
    isAdmin: Boolean,
    isActive: Boolean,
    authProvider: String
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  // List existing admins
  const admins = await User.find({ $or: [{ isAdmin: true }, { role: 'admin' }, { role: 'super_admin' }] });
  console.log('\n--- EXISTING ADMINS (' + admins.length + ') ---');
  for (const a of admins) {
    console.log(`- ${a.name} | ${a.email} | role: ${a.role} | isAdmin: ${a.isAdmin}`);
  }

  // Create or update dedicated admin
  const targetEmail = 'admin@cuchd.in';
  const targetPassword = 'Admin@CodeSkill2026';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(targetPassword, salt);

  let adminUser = await User.findOne({ email: targetEmail });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Chandigarh University Administrator',
      email: targetEmail,
      password: hashedPassword,
      role: 'super_admin',
      isAdmin: true,
      isActive: true,
      authProvider: 'local'
    });
    console.log('\n✅ Created new Admin account:', targetEmail);
  } else {
    adminUser.password = hashedPassword;
    adminUser.isAdmin = true;
    adminUser.role = 'super_admin';
    adminUser.isActive = true;
    await adminUser.save();
    console.log('\n✅ Updated existing Admin account with new password:', targetEmail);
  }

  console.log('\n========================================');
  console.log('ADMIN LOGIN CREDENTIALS:');
  console.log('Portal URL: http://localhost:3000/admin/login or http://localhost:3000/login');
  console.log('Email:    admin@cuchd.in');
  console.log('Password: Admin@CodeSkill2026');
  console.log('Role:     super_admin');
  console.log('========================================\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
