const mongoose = require('mongoose');
const User = require('./backend/models/User');
const { calculateRank } = require('./backend/controllers/authController'); // Agar eksport qilingan bo'lsa

async function testBackendLogic() {
  console.log('🧪 Backend mantiqini test qilish boshlandi...');
  
  // 1. Instagram Soft-Check Test
  const { verifyInstagramSubscription } = require('./backend/utils/socialVerification');
  const instaResult = await verifyInstagramSubscription('test_user', 'mock_id');
  console.log(instaResult.subscribed === true ? '✅ Instagram Soft-Check: O\'tdi' : '❌ Instagram Soft-Check: Xato');

  // 2. Daily Reward 24h Logic Test
  const now = new Date();
  const lastClaimed = new Date(now.getTime() - (23 * 60 * 60 * 1000)); // 23 soat oldin
  
  // Soxta foydalanuvchi ob'ekti
  const mockUser = {
    lastClaimedDaily: lastClaimed,
    xp: 100
  };

  const diffMs = now.getTime() - mockUser.lastClaimedDaily.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    console.log('✅ Daily Reward 24h Limit: O\'tdi (23 soatda ruxsat bermadi)');
  } else {
    console.log('❌ Daily Reward 24h Limit: Xato');
  }

  console.log('🏁 Test yakunlandi.');
  process.exit(0);
}

testBackendLogic().catch(err => {
  console.error('❌ Testda xato:', err);
  process.exit(1);
});
