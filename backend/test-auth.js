require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const connectDB = require("./config/db");

async function run() {
  await connectDB();
  const user = await User.findOne({ isAdmin: true });
  if (!user) {
    console.log("No admin found");
    process.exit(1);
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  console.log(token);
  process.exit(0);
}
run();
