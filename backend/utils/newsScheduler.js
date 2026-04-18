/**
 * AIDEVIX AI NEWS & TIPS SCHEDULER
 *
 * Kuniga 3 marta (10:00, 16:00, 20:00 Toshkent vaqti) eng so'nggi AI/IT
 * yangiliklar va Prompt Engineering maslahatlarini Telegram kanalga yuboradi.
 *
 * Xususiyatlar:
 * - 15+ sifatli RSS manba (AI, IT, Developer)
 * - Dublikat himoyasi (yuborilgan linklar saqlanadi)
 * - Faqat oxirgi 24 soatdagi yangiliklar
 * - Har safar boshqa manbadan tanlash (kategoriya balans)
 * - Groq AI orqali o'zbek tiliga tahliliy post tayyorlash
 */

const RssParser = require('rss-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const parser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Aidevix-NewsBot/4.0' },
});

// Yuborilgan yangiliklar faylga saqlanadi (dublikat oldini olish)
const SENT_FILE = path.join(__dirname, '..', '.sent_news.json');

const RSS_FEEDS = [
  // --- AI Core ---
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI' },
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml', category: 'AI' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/feed', category: 'AI' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'AI' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml', category: 'AI' },

  // --- IT / Tech ---
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'IT' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'IT' },
  { name: 'The Next Web', url: 'https://thenextweb.com/feed', category: 'IT' },

  // --- Developer ---
  { name: 'Dev.to', url: 'https://dev.to/feed/tag/ai', category: 'DEV' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best?q=AI+OR+LLM+OR+GPT+OR+Claude', category: 'DEV' },
  { name: 'GitHub Blog', url: 'https://github.blog/feed/', category: 'DEV' },
  { name: 'InfoQ AI', url: 'https://feed.infoq.com/ai-ml-data-eng/', category: 'DEV' },
];

// --- Dublikat boshqaruvi ---

function loadSentLinks() {
  try {
    if (fs.existsSync(SENT_FILE)) {
      const data = JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'));
      // Faqat oxirgi 7 kunlik linklar saqlanadi (tozalash)
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const filtered = data.filter(entry => entry.ts > weekAgo);
      if (filtered.length !== data.length) {
        fs.writeFileSync(SENT_FILE, JSON.stringify(filtered, null, 2));
      }
      return new Set(filtered.map(e => e.link));
    }
  } catch (err) {
    console.error('[News] Sent file read error:', err.message);
  }
  return new Set();
}

function markAsSent(link) {
  try {
    let data = [];
    if (fs.existsSync(SENT_FILE)) {
      data = JSON.parse(fs.readFileSync(SENT_FILE, 'utf8'));
    }
    data.push({ link, ts: Date.now() });
    fs.writeFileSync(SENT_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[News] Sent file write error:', err.message);
  }
}

// --- Yordamchi funksiyalar ---

function extractImage(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  const content = item.content || item.contentSnippet || '';
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  if (match && match[1]) return match[1];
  if (item['media:content'] && item['media:content'].$) return item['media:content'].$.url;
  return null;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// --- AI Post generatsiya ---

async function generateAIPost(item) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const snippet = stripHtml(item.contentSnippet || '').substring(0, 500);
    const prompt = `Sen Aidevix platformasining AI va dasturlash bo'yicha ekspertisan.
Quyidagi yangilikni tahlil qilib, o'zbek tilida Telegram kanal uchun qiziqarli post tayyorla.

MAVZU: AI, LLM, Claude, GPT, Vibe Coding, Prompt Engineering yoki eng so'nggi IT trendlar.

Original: ${item.title} - ${snippet}
Manba: ${item.source}

POST FORMATI:
1. Qiziqarli o'zbekcha sarlavha (emoji bilan)
2. Yangilik tahlili — nimaga muhim, dasturchilar uchun qanday foyda (3-5 jumla)
3. PROMPT TIP: Shu texnologiyadan foydalanish uchun 1 ta amaliy maslahat

Javobni FAQAT JSON formatda ber:
{
  "title": "Sarlavha",
  "content": "Tahlil matni",
  "prompt_tip": "💡 Amaliy maslahat"
}`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      timeout: 30000,
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('[News] AI generation error:', error.message);
    return null;
  }
}

// --- RSS dan yangiliklar olish ---

async function fetchLatestNews() {
  const allItems = [];
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return (parsed.items || []).map(i => ({
          title: i.title,
          content: i.content,
          contentSnippet: i.contentSnippet,
          link: i.link,
          image: extractImage(i),
          pubDate: new Date(i.pubDate || Date.now()),
          source: feed.name,
          category: feed.category,
        }));
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  // Faqat oxirgi 24 soatdagi yangiliklar
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = allItems.filter(item => item.pubDate > oneDayAgo);

  // Agar 24 soatda kam bo'lsa, oxirgi 48 soatni olish
  if (recent.length < 3) {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const extended = allItems.filter(item => item.pubDate > twoDaysAgo);
    return extended.sort((a, b) => b.pubDate - a.pubDate);
  }

  return recent.sort((a, b) => b.pubDate - a.pubDate);
}

// --- Yangilik tanlash (dublikatsiz, kategoriya balans) ---

function pickBestItem(newsList, sentLinks) {
  // Yuborilmaganlarni filtrlash
  const unsent = newsList.filter(item => !sentLinks.has(item.link));
  if (unsent.length === 0) return newsList[0] || null;

  // Kategoriyalar bo'yicha guruhlash
  const byCategory = {};
  for (const item of unsent) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }

  // Har safar boshqa kategoriyadan olish (soatga qarab)
  const categories = Object.keys(byCategory);
  if (categories.length === 0) return unsent[0];

  const now = new Date();
  const tashkentHour = (now.getUTCHours() + 5) % 24;
  const catIndex = tashkentHour % categories.length;
  const selectedCategory = categories[catIndex];

  return byCategory[selectedCategory][0];
}

// --- Kanalga post yuborish ---

async function postNewsToChannel() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
  if (!botToken || !channel) return false;

  try {
    const newsList = await fetchLatestNews();
    if (newsList.length === 0) {
      console.log('[News] Yangilik topilmadi');
      return false;
    }

    const sentLinks = loadSentLinks();
    const item = pickBestItem(newsList, sentLinks);
    if (!item) {
      console.log('[News] Barcha yangiliklar allaqachon yuborilgan');
      return false;
    }

    const aiData = await generateAIPost(item);
    if (!aiData) return false;

    const message =
      `🚀 <b>${aiData.title}</b>\n\n` +
      `${aiData.content}\n\n` +
      `${aiData.prompt_tip}\n\n` +
      `🔗 <a href="${item.link}">To'liq o'qish</a> | 📡 ${item.source}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>Aidevix</b> — Kelajak bilan birga bo'ling\n` +
      `🌐 aidevix.uz | @aidevix_bot\n\n` +
      `#ai #claudecode #vibecoding #prompt #yangiliklar`;

    const chatId = channel.startsWith('@') ? channel : `@${channel}`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔥', callback_data: 'news_react_fire' },
          { text: '🚀', callback_data: 'news_react_rocket' },
          { text: '💡', callback_data: 'news_react_bulb' },
        ],
        [
          { text: '📢 Do\'stlarga ulashish', url: `https://t.me/share/url?url=${encodeURIComponent(item.link)}&text=${encodeURIComponent(aiData.title)}` },
        ],
      ],
    };

    if (item.image) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        chat_id: chatId,
        photo: item.image,
        caption: message,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } else {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: keyboard,
      });
    }

    // Yuborilgan deb belgilash
    markAsSent(item.link);
    console.log(`[News] Yuborildi: "${item.title}" (${item.source})`);
    return true;
  } catch (error) {
    console.error('[News] Post error:', error.message);
    return false;
  }
}

// --- Scheduler ---

function startNewsScheduler() {
  const enabled = process.env.NEWS_ENABLED === 'true' || process.env.SEND_NEWS === 'true';
  if (!enabled) return;

  const scheduleHours = [10, 16, 20];
  console.log(`[News] Kunlik AI News ishga tushdi: ${scheduleHours.join(':00, ')}:00 (Toshkent)`);

  let lastPostedSlot = '';

  setInterval(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];
    const currentSlot = `${todayStr}-${tashkentHour}`;

    if (scheduleHours.includes(tashkentHour) && lastPostedSlot !== currentSlot) {
      lastPostedSlot = currentSlot;
      await postNewsToChannel();
    }
  }, 10 * 60 * 1000);
}

module.exports = { startNewsScheduler, postNewsToChannel };
