const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5001/api/health');
    console.log('Health check:', res.status, res.data);
    
    // We expect 401 for protected routes without token
    try {
      await axios.get('http://localhost:5001/api/admin/users?search=&adminsOnly=false');
    } catch(err) {
      console.log('Admin Users (No Token):', err.response?.status); // Should be 401
    }

    try {
      await axios.get('http://localhost:5001/api/admin/dashboard/stats');
    } catch(err) {
      console.log('Admin Dashboard (No Token):', err.response?.status); // Should be 401
    }
    
    try {
      await axios.get('http://localhost:5001/api/problems');
      console.log('Problems list works');
    } catch(err) {
      console.log('Problems list error:', err.response?.status);
    }
  } catch(e) {
    console.error(e.message);
  }
}
test();
