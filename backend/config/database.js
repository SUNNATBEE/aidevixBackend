const mongoose = require('mongoose');
const dns = require('dns');

// Set custom DNS servers (Google DNS and Cloudflare DNS) for better reliability
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return;
    }

    console.log('🔄 Connecting to MongoDB...');
    
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
    };

    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query) => {
        console.log(`[MongoDB] ${collectionName}.${method}`, JSON.stringify(query));
      });
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️  Database connection failed in production. Server will continue but database operations will fail.');
    } else {
      console.error('\n📋 Troubleshooting steps:');
      console.error('1. Check MongoDB Atlas cluster is running');
      console.error('2. Verify Network Access (IP whitelist includes 0.0.0.0/0)');
      console.error('3. Verify database user credentials');
      console.error('4. Check environment variables are set correctly');
    }
  }
};

module.exports = connectDB;
