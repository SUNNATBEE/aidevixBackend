// Quick test script to check why register returns 500
const https = require('https');

const data = JSON.stringify({
  username: 'testdebug_' + Date.now(),
  email: `testdebug_${Date.now()}@example.com`,
  password: 'Test1234!'
});

const options = {
  hostname: 'aidevix-backend-production.up.railway.app',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:', body);
    try {
      console.log('Parsed:', JSON.stringify(JSON.parse(body), null, 2));
    } catch(e) {}
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(data);
req.end();
