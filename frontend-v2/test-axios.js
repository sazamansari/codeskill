const axios = require('axios');
const { adminDashboardAPI } = require('./src/config/api.ts');

adminDashboardAPI.getStats().catch(e => {
    console.log("BaseURL:", e.config.baseURL);
    console.log("URL:", e.config.url);
    console.log("Full URI:", axios.getUri(e.config));
});
