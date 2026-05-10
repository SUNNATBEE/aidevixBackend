const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const { makeStore } = require('../config/redis');

const { getLiveActivity, getTeamMembers, getRoadmap, submitContact } = require('../controllers/publicController');
const { getPublicAiNews, trackAiNewsClick } = require('../controllers/aiNewsController');

// Contact form anti-spam — 5/soat per IP (spam'ning oddiy oldini olish)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('contact'),
  message: { success: false, message: 'Soatiga 5 tadan ortiq xabar yuborib bo\'lmaydi. Keyinroq urinib ko\'ring.' },
  keyGenerator: ipKeyGenerator,
});

router.get('/live-activity', getLiveActivity);
router.get('/team', getTeamMembers);
router.get('/roadmap', getRoadmap);
router.get('/ai-news', getPublicAiNews);
router.post('/ai-news/:id/click', trackAiNewsClick);
router.post('/contact', contactLimiter, submitContact);

module.exports = router;

