const mongoose = require('mongoose');
require('dotenv').config();
const Video = require('../models/Video');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const videos = await Video.find({ bunnyVideoId: { $exists: true } }).limit(5);
  console.log(JSON.stringify(videos, null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
