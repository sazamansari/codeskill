const path = require('path');
const fs = require('fs');

// Load environment variables from backend-nestjs/.env
const envPath = path.join(__dirname, '../backend-nestjs/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const backendModules = path.join(__dirname, '../backend-nestjs/node_modules');
const mongoose = require(path.join(backendModules, 'mongoose'));
const bcrypt = require(path.join(backendModules, 'bcryptjs'));

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URI || 'mongodb+srv://mdshadabazamansari:123123123123@cluster0.gwcfd5x.mongodb.net/codeskill?retryWrites=true&w=majority';

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
    console.log(`- ${a.name} | ${a.email} | role: ${a.role || 'admin'} | isAdmin: ${a.isAdmin}`);
  }

  // CLI Arguments or Default list of admins to seed
  const cliEmail = process.argv[2];
  const cliPassword = process.argv[3];
  const cliName = process.argv[4];

  const adminList = [
    {
      email: 'admin@codeskill.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'System Administrator',
      role: 'super_admin'
    },
    {
      email: 'admin@cuchd.in',
      password: process.env.ADMIN_CUCHD_PASSWORD || 'Admin@CodeSkill2026',
      name: 'Chandigarh University Administrator',
      role: 'super_admin'
    },
    {
      email: 'md.shadab.azam.ansari@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Md Shadab Azam Ansari',
      role: 'super_admin'
    }
  ];

  if (cliEmail && cliPassword) {
    adminList.unshift({
      email: cliEmail.trim().toLowerCase(),
      password: cliPassword.trim(),
      name: cliName || 'Administrator',
      role: 'super_admin'
    });
  }

  console.log('\n--- SEEDING / UPDATING ADMIN ACCOUNTS ---');
  for (const item of adminList) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(item.password, salt);

    let adminUser = await User.findOne({ email: item.email.toLowerCase() });
    if (!adminUser) {
      adminUser = await User.create({
        name: item.name,
        email: item.email.toLowerCase(),
        password: hashedPassword,
        role: item.role,
        isAdmin: true,
        isActive: true,
        authProvider: 'local'
      });
      console.log(`✅ Created Admin: ${item.email} (Password: ${item.password})`);
    } else {
      adminUser.password = hashedPassword;
      adminUser.isAdmin = true;
      adminUser.role = item.role;
      adminUser.isActive = true;
      if (!adminUser.name || adminUser.name === 'undefined') {
        adminUser.name = item.name;
      }
      await adminUser.save();
      console.log(`✅ Updated Admin: ${item.email} (Password: ${item.password})`);
    }
  }

  console.log('\n========================================');
  console.log('ACTIVE ADMIN LOGIN CREDENTIALS:');
  console.log('----------------------------------------');
  for (const item of adminList) {
    console.log(`Email:    ${item.email}`);
    console.log(`Password: ${item.password}`);
    console.log(`Role:     ${item.role}`);
    console.log('----------------------------------------');
  }
  console.log('Login URL: /login or /admin/login');
  console.log('========================================\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
