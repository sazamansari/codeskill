const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/codeskill";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const admin = await db.collection('users').findOne({ isAdmin: true });
    
    if (!admin) {
      console.log("No admin found in DB.");
      return;
    }
    console.log("Found admin:", admin.email);

    // Create token
    const token = jwt.sign(
      { _id: admin._id.toString(), email: admin.email, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      { expiresIn: '1d' }
    );
    
    console.log("Generated token:", token.substring(0,20)+"...");

    // Make request
    const res = await axios.get('http://localhost:5001/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS:", res.status);
    console.log(res.data);
  } catch (e) {
    if (e.response) {
      console.log("FAILED WITH STATUS:", e.response.status);
      console.log(e.response.data);
    } else {
      console.log("ERROR:", e.message);
    }
  } finally {
    await client.close();
  }
}
run();
