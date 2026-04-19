/**
 * AIDEVIX DAILY CHALLENGE SCHEDULER
 *
 * Har kuni yarim tunda (00:00 Toshkent) avtomatik AI-challenge yaratadi
 * va Telegram kanalga e'lon yuboradi.
 *
 * Challenge turlari:
 * - watch_video   — Bugun N ta video ko'r
 * - complete_quiz — N ta quizni yakunla
 * - streak        — Streakni davom ettir
 * - use_ai_tool   — AI tool bilan loyiha qur (shaxsiy bajarish)
 * - share_prompt  — Prompt kutubxonasiga N ta prompt qo'sh
 */

const axios = require('axios');
const schedulerState = require('./schedulerState');

// Kunlik challenge variantlari (navbat bilan)
const CHALLENGE_POOL = [
  {
    title: '🎬 Video Marathon',
    description: 'Bugun 3 ta video dars ko\'ring va bilimingizni mustahkamlang!',
    type: 'watch_video',
    targetCount: 3,
    xpReward: 150,
  },
  {
    title: '🧠 Quiz Champion',
    description: 'Bugun 2 ta quizni muvaffaqiyatli yakunlang va prolingizni oshiring!',
    type: 'complete_quiz',
    targetCount: 2,
    xpReward: 120,
  },
  {
    title: '🔥 Streak Warrior',
    description: 'Bugun ham platformaga kiring va streak zanjirini uzmasligi kuzating!',
    type: 'streak',
    targetCount: 1,
    xpReward: 80,
  },
  {
    title: '⚡ Vibe Coder Challenge',
    description: 'Claude Code yoki Cursor yordamida bugun biror loyiha yoki komponent yozing! Prompt kutubxonasiga natijangizni qo\'shing.',
    type: 'share_prompt',
    targetCount: 1,
    xpReward: 200,
  },
  {
    title: '📚 AI Tools Explorer',
    description: 'Bugun 5 ta video ko\'ring. AI tools haqidagi bilimingizni kengaytiring!',
    type: 'watch_video',
    targetCount: 5,
    xpReward: 250,
  },
  {
    title: '💡 Prompt Master',
    description: 'Prompt kutubxonasiga 2 ta sifatli prompt yozing va hamjamiyatga ulashing!',
    type: 'share_prompt',
    targetCount: 2,
    xpReward: 180,
  },
  {
    title: '🚀 Knowledge Sprint',
    description: 'Bugun 3 ta quizni muvaffaqiyatli yakunlang!',
    type: 'complete_quiz',
    targetCount: 3,
    xpReward: 160,
  },
];

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getTashkentHour() {
  return (new Date().getUTCHours() + 5) % 24;
}

async function createDailyChallenge() {
  try {
    const { DailyChallenge } = require('../models/DailyChallenge');
    const todayStr = getTodayStr();

    // Allaqachon bor?
    const existing = await DailyChallenge.findOne({ date: todayStr });
    if (existing) return existing;

    // Pool dan ketma-ket tanlash (hafta kuni bo'yicha)
    const dayOfWeek = new Date().getDay(); // 0=Sunday
    const challenge = CHALLENGE_POOL[dayOfWeek % CHALLENGE_POOL.length];

    const created = await DailyChallenge.create({
      ...challenge,
      date: todayStr,
      isActive: true,
    });

    console.log(`[ChallengeScheduler] Kunlik vazifa yaratildi: "${created.title}" (${todayStr})`);
    await sendChallengeToChannel(created);
    return created;
  } catch (err) {
    console.error('[ChallengeScheduler] Challenge yaratishda xato:', err.message);
    return null;
  }
}

async function getActiveChallengeChannels() {
  try {
    const BotChannel = require('../models/BotChannel');
    const dbChannels = await BotChannel.find({ isActive: true, sendChallenges: true });
    const channels = dbChannels.map(c => c.chatId);

    const mainChannel = process.env.TELEGRAM_CHANNEL_USERNAME;
    if (mainChannel) {
      const mainId = mainChannel.startsWith('@') ? mainChannel : `@${mainChannel}`;
      if (!channels.includes(mainId) && !channels.includes(mainChannel)) {
        channels.unshift(mainId);
      }
    }
    return channels;
  } catch {
    const ch = process.env.TELEGRAM_CHANNEL_USERNAME;
    return ch ? [ch.startsWith('@') ? ch : `@${ch}`] : [];
  }
}

async function sendChallengeToChannel(challenge) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const channels = await getActiveChallengeChannels();
  if (channels.length === 0) return;

  const categoryEmoji = {
    watch_video: '🎬',
    complete_quiz: '🧠',
    streak: '🔥',
    share_prompt: '💡',
    use_ai_tool: '⚡',
  };

  const emoji = categoryEmoji[challenge.type] || '🚀';

  const tgChannel     = process.env.TELEGRAM_CHANNEL_USERNAME || 'aidevix';
  const tgChannelLink = `https://t.me/${tgChannel.replace('@', '')}`;
  const igLink        = process.env.INSTAGRAM_URL || 'https://instagram.com/aidevix.uz';
  const siteLink      = process.env.SITE_URL || 'https://aidevix.uz';
  const dateStr       = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });

  const message =
    `${emoji} <b>KUNLIK VAZIFA — ${dateStr}</b>\n\n` +
    `🏆 <b>${challenge.title}</b>\n\n` +
    `${challenge.description}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⚡ Mukofot: <b>+${challenge.xpReward} XP</b>\n` +
    `🎯 Maqsad: <b>${challenge.targetCount} ta</b>\n\n` +
    `<b>Aidevix</b> — AI & Dasturlash O'quv Platformasi 🇺🇿\n\n` +
    `📢 Kanal: <a href="${tgChannelLink}">@${tgChannel.replace('@', '')}</a>\n` +
    `📸 Instagram: <a href="${igLink}">@aidevix.uz</a>\n` +
    `🌐 Sayt: <a href="${siteLink}">aidevix.uz</a>\n\n` +
    `#DailyChallenge #Aidevix #VibeCoding #AI`;

  const keyboard = {
    inline_keyboard: [
      [{ text: `${emoji} Vazifani boshlash`, url: `${siteLink}/challenges` }],
      [
        { text: '📢 Kanalga obuna bo\'l', url: tgChannelLink },
        { text: '📸 Instagram', url: igLink },
      ],
      [
        { text: '🔥', callback_data: 'news_react_fire' },
        { text: '💡', callback_data: 'news_react_bulb' },
        { text: '🚀', callback_data: 'news_react_rocket' },
      ],
    ],
  };

  let sentCount = 0;
  for (const chatId of channels) {
    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId, text: message, parse_mode: 'HTML', reply_markup: keyboard,
      });
      sentCount++;
      schedulerState.addLog('challenge', chatId, challenge.title, true);
    } catch (err) {
      schedulerState.addLog('challenge', chatId, 'Xatolik: ' + (err.response?.data?.description || err.message), false);
      console.error(`[ChallengeScheduler] Kanal xatosi (${chatId}):`, err.response?.data?.description || err.message);
    }
  }
  console.log(`[ChallengeScheduler] Challenge yuborildi → ${sentCount}/${channels.length} kanal: "${challenge.title}"`);
}

function startChallengeScheduler() {
  if (!schedulerState.isChallengeEnabled()) {
    console.log('[ChallengeScheduler] O\'chirilgan (CHALLENGE_SCHEDULER_ENABLED=false). /toggle challenge bilan yoqish mumkin.');
  }

  console.log('[ChallengeScheduler] Kunlik challenge scheduler ishga tushdi (00:05 Toshkent)');

  // Ishga tushganda darhol tekshirish (agar kechagi process restart bo'lgan bo'lsa)
  setTimeout(() => {
    if (schedulerState.isChallengeEnabled()) createDailyChallenge();
  }, 5000);

  // Har 10 daqiqada tekshirish — Toshkent 00:00-00:10 oralig'ida yaratish
  let lastCreatedDate = '';
  setInterval(async () => {
    if (!schedulerState.isChallengeEnabled()) return;
    const hour = getTashkentHour();
    const todayStr = getTodayStr();

    if (hour === 0 && lastCreatedDate !== todayStr) {
      lastCreatedDate = todayStr;
      await createDailyChallenge();
    }
  }, 10 * 60 * 1000);
}

module.exports = { startChallengeScheduler, createDailyChallenge };
