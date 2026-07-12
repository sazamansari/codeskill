const axios = require('axios');

async function test() {
  try {
    const payload = {
      language: "javascript",
      code: `
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
      `,
      testCases: [
        {
          id: 1,
          input: "[2,7,11,15]\\n9",
          expected: [0, 1]
        }
      ]
    };

    const res = await axios.post('http://localhost:5001/api/execution/run', payload);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

test();
