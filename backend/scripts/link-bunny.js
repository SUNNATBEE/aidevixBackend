/**
 * Bunny.net videolarni DB ga ulash skripti
 * 
 * Ishlatish:
 * 1. `bunnyMappings` ni to'ldiring (DB video ID → Bunny GUID)
 * 2. node scripts/link-bunny.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ═══════════════════════════════════════════════════
// ⬇️ BU YERGA O'Z MA'LUMOTLARINGIZNI KIRITING ⬇️
// ═══════════════════════════════════════════════════
const bunnyMappings = [
  // { videoId: 'DB dagi _id', bunnyId: 'Bunny GUID' },
  // Masalan:
  // { videoId: '69d4a87db047c8a7224151a3', bunnyId: 'abc123-def456-7890' },
];
// ═══════════════════════════════════════════════════

const Video = mongoose.model('Video', new mongoose.Schema({
  bunnyVideoId: String,
  bunnyStatus: String,
  title: String,
}, { strict: false }));

async function linkBunny() {
  if (bunnyMappings.length === 0) {
    console.log('❌ bunnyMappings bo\'sh! Avval videoId va bunnyId ni kiriting.');
    console.log('\n📋 DB dagi videolar:');
    const videos = await Video.find({}).select('_id title bunnyVideoId').lean();
    videos.forEach((v, i) => {
      console.log(`${i + 1}. ${v._id} | bunny: ${v.bunnyVideoId || '❌ YO\'Q'} | ${v.title}`);
    });
    return;
  }

  for (const { videoId, bunnyId } of bunnyMappings) {
    const result = await Video.findByIdAndUpdate(
      videoId,
      { bunnyVideoId: bunnyId, bunnyStatus: 'ready' },
      { new: true }
    );
    if (result) {
      console.log(`✅ Ulandi: "${result.title}" → Bunny: ${bunnyId}`);
    } else {
      console.log(`❌ Topilmadi: ${videoId}`);
    }
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB ulandi\n');
    await linkBunny();
    mongoose.disconnect();
    console.log('\n✅ Tayyor!');
  })
  .catch(err => {
    console.error('❌ Xato:', err.message);
    process.exit(1);
  });
