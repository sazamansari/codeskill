const axios = require('axios');

async function test() {
  try {
    // 1. Login
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@codeskill.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log("Got token:", token.substring(0, 20) + "...");

    // 2. Fetch stats
    const statsRes = await axios.get('http://localhost:5001/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Stats response:", statsRes.status, statsRes.data);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error data:", err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
}

test();
