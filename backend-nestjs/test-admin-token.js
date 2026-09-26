const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

async function test() {
  const token = jwt.sign({ _id: 'fakeadminid', isAdmin: true, email: 'admin@codeskill.com' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  
  try {
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
