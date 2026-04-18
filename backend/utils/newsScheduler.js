/**
 * ═══════════════════════════════════════════════════════════════════
 * AIDEVIX NEWS SCHEDULER — IT/AI yangiliklar avtomatik postlash
 * ═══════════════════════════════════════════════════════════════════
 *
 * Kuniga 1 marta (09:00 Toshkent vaqti) IT va AI yangiliklar
 * RSS feedlardan olib, chiroyli formatda @aidevix kanalga yuboradi.
 *
 * Env vars:
 *   NEWS_ENABLED=true          — yoqish/o'chirish (default: false)
 *   NEWS_HOUR=9                — Toshkent vaqtida soat (default: 9)
 *   NEWS_MAX_ITEMS=5           — nechta yangilik (default: 5)
 */

const RssParser = require('rss-parser');
const axios = require('axios');

const parser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Aidevix-NewsBot/1.0' },
});

// ─── RSS manbalar ────────────────────────────────────────────────
const RSS_FEEDS = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'AI',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'AI',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'IT',
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    category: 'AI',
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'IT',
  },
];

// ─── AI/IT kalit so'zlar (filtrlash uchun) ──────────────────────
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'chatgpt', 'openai', 'claude', 'anthropic', 'gemini', 'gpt',
  'neural', 'llm', 'transformer', 'generative', 'automation',
  'robot', 'computer vision', 'nlp', 'data science',
  'programming', 'developer', 'software', 'coding', 'tech',
  'startup', 'cloud', 'api', 'open source', 'cybersecurity',
  'apple', 'google', 'microsoft', 'meta', 'nvidia', 'tesla',
];

// ─── Kategori emoji mapping ─────────────────────────────────────
const CATEGORY_EMOJI = {
  AI: '🤖',
  IT: '💻',
  Security: '🔒',
  Startup: '🚀',
  Cloud: '☁️',
  Mobile: '📱',
};

/**
 * HTML teglarni olib tashlash
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matnni qisqartirish (Telegram limit uchun)
 */
function truncate(text, maxLen = 200) {
  if (!text || text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 100 ? cut.substring(0, lastSpace) : cut) + '...';
}

/**
 * Yangilikni AI/IT ekanligini tekshirish
 */
function isRelevant(item) {
  const text = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  return AI_KEYWORDS.some(kw => text.includes(kw));
}

/**
 * Kategoriya aniqlash
 */
function detectCategory(item, feedCategory) {
  const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
  if (/\bai\b|artificial intelligence|machine learning|llm|chatgpt|openai|claude|gemini|gpt/i.test(text)) return 'AI';
  if (/security|cyber|hack|breach|vulnerability/i.test(text)) return 'Security';
  if (/startup|funding|raised|valuation/i.test(text)) return 'Startup';
  if (/cloud|aws|azure|gcp/i.test(text)) return 'Cloud';
  if (/mobile|ios|android|iphone/i.test(text)) return 'Mobile';
  return feedCategory || 'IT';
}

/**
 * Barcha RSS feedlardan yangiliklar olish
 */
async function fetchAllNews() {
  const allItems = [];

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return (parsed.items || []).map(item => ({
          title: stripHtml(item.title),
          description: truncate(stripHtml(item.contentSnippet || item.content || item.summary || ''), 200),
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: feed.name,
          feedCategory: feed.category,
        }));
      } catch (err) {
        console.error(`[News] ${feed.name} RSS xato:`, err.message);
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  return allItems;
}

/**
 * Eng yaxshi yangiliklar tanlash (bugun, relevant, unique)
 */
function selectTopNews(items, maxItems = 5) {
  const oneDayAgo = new Date(Date.now() - 48 * 60 * 60 * 1000); // Oxirgi 48 soat

  // Filtrlash: vaqt + relevantlik
  const filtered = items
    .filter(item => item.pubDate >= oneDayAgo)
    .filter(item => isRelevant(item))
    .sort((a, b) => b.pubDate - a.pubDate);

  // Dublikatlarni olib tashlash (sarlavha bo'yicha)
  const seen = new Set();
  const unique = [];
  for (const item of filtered) {
    const key = item.title.toLowerCase().substring(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.slice(0, maxItems);
}

/**
 * Telegram uchun chiroyli xabar formatlash
 */
function formatNewsMessage(newsItems) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let message = '';
  message += `📡 <b>KUNLIK IT & AI YANGILIKLAR</b>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📅 ${dateStr}\n\n`;

  for (let i = 0; i < newsItems.length; i++) {
    const item = newsItems[i];
    const category = detectCategory(item, item.feedCategory);
    const emoji = CATEGORY_EMOJI[category] || '📰';
    const num = i + 1;

    message += `${emoji} <b>${num}. ${item.title}</b>\n`;
    if (item.description) {
      message += `<i>${item.description}</i>\n`;
    }
    message += `🔗 <a href="${item.link}">Batafsil o'qish</a> • <code>${item.source}</code>\n\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🚀 <b>Aidevix</b> — Bepul IT kurslar platformasi\n`;
  message += `🌐 aidevix.uz | @aidevix_bot\n\n`;
  message += `#yangiliklar #it #ai #texnologiya`;

  return message;
}

/**
 * Kanalga yangilik yuborish
 */
async function postNewsToChannel() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;

  if (!botToken || !channelUsername) {
    console.warn('[News] BOT_TOKEN yoki CHANNEL_USERNAME sozlanmagan');
    return false;
  }

  try {
    console.log('[News] Yangiliklar olinmoqda...');
    const allNews = await fetchAllNews();
    console.log(`[News] Jami ${allNews.length} ta yangilik topildi`);

    const maxItems = parseInt(process.env.NEWS_MAX_ITEMS) || 5;
    const topNews = selectTopNews(allNews, maxItems);

    if (topNews.length === 0) {
      console.log('[News] Bugungi yangiliklar topilmadi, post yuborilmadi');
      return false;
    }

    console.log(`[News] ${topNews.length} ta yangilik tanlandi, kanalga yuborilmoqda...`);
    const message = formatNewsMessage(topNews);

    // Telegram xabar limiti 4096 belgi
    if (message.length > 4096) {
      console.warn(`[News] Xabar juda uzun (${message.length}), qisqartirilmoqda...`);
      // Kamroq yangilik bilan qayta formatlaymiz
      const shorterNews = topNews.slice(0, 3);
      const shorterMessage = formatNewsMessage(shorterNews);
      await sendToChannel(botToken, channelUsername, shorterMessage);
    } else {
      await sendToChannel(botToken, channelUsername, message);
    }

    console.log('[News] ✅ Yangiliklar kanalga muvaffaqiyatli yuborildi');
    return true;
  } catch (error) {
    console.error('[News] Yangilik yuborishda xato:', error.message);
    return false;
  }
}

/**
 * Telegram kanalga xabar yuborish
 */
async function sendToChannel(botToken, channelUsername, message) {
  const chatId = /^-?\d+$/.test(channelUsername) ? channelUsername : `@${channelUsername}`;
  await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
}

// ─── SCHEDULER (Cron) ────────────────────────────────────────────

let lastPostedDate = null; // Kuniga faqat 1 marta

function startNewsScheduler() {
  const enabled = process.env.NEWS_ENABLED === 'true';
  if (!enabled) {
    console.log('[News] Yangiliklar scheduler o\'chirilgan (NEWS_ENABLED=true qilib yoqing)');
    return;
  }

  const targetHour = parseInt(process.env.NEWS_HOUR) || 9;
  console.log(`[News] 📡 Yangiliklar scheduler ishga tushdi — har kuni soat ${targetHour}:00 (Toshkent vaqti)`);

  // Har 30 daqiqada tekshirish (aniqroq vaqtda post qilish uchun)
  setInterval(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];

    // Target soatda va bugun hali post qilinmagan bo'lsa
    if (tashkentHour === targetHour && lastPostedDate !== todayStr) {
      lastPostedDate = todayStr;
      await postNewsToChannel();
    }
  }, 30 * 60 * 1000); // Har 30 daqiqa

  // Dastlab 1 daqiqadan keyin ham tekshiramiz (server qayta ishga tushganda)
  setTimeout(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];

    if (tashkentHour >= targetHour && lastPostedDate !== todayStr) {
      lastPostedDate = todayStr;
      console.log('[News] Server qayta tushdi, bugungi yangilik yuborilmoqda...');
      await postNewsToChannel();
    }
  }, 60 * 1000);
}

module.exports = {
  startNewsScheduler,
  postNewsToChannel, // Manual test uchun
  fetchAllNews,      // Debug uchun
  selectTopNews,
};
