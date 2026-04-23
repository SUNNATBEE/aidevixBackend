const mongoose = require('mongoose');
const dns = require('dns');
const axios = require('axios');

async function debugConnection() {
  console.log('--- MongoDB Connection Debugger ---');
  
  // 1. Get Public IP
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log(`Current Public IP: ${response.data.ip}`);
    console.log('Ensure this IP (or 0.0.0.0/0) is whitelisted in MongoDB Atlas.');
  } catch (err) {
    console.error('Failed to get public IP:', err.message);
  }

  // 2. Test DNS Resolution
  const host = 'cluster0.xklnxey.mongodb.net';
  console.log(`Testing DNS resolution for: ${host}`);
  dns.resolveSrv('_mongodb._tcp.' + host, (err, addresses) => {
    if (err) {
      console.error('DNS SRV Resolution Failed:', err.message);
    } else {
      console.log('DNS SRV Hosts Resolved:', addresses);
    }
  });

  dns.resolveTxt(host, (err, addresses) => {
    if (err) {
        console.error('DNS TXT Resolution Failed:', err.message);
    } else {
        console.log('DNS TXT Records:', addresses);
    }
  });

  // 3. Attempt Connection
  const uri = 'mongodb+srv://aidevixnew:scroodgee2001@cluster0.xklnxey.mongodb.net/aidevix?retryWrites=true&w=majority&appName=Cluster0';
  console.log('Attempting connection...');
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connection Successful!');
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    console.error('Error Code:', err.code);
    console.error('Error Name:', err.name);
  }
}

debugConnection();
