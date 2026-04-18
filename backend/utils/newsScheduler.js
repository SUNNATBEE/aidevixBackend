/**
 * ═══════════════════════════════════════════════════════════════════
 * AIDEVIX ADVANCED AI NEWS & TIPS SCHEDULER
 * ═══════════════════════════════════════════════════════════════════
 *
 * Kuniga 3 marta (10:00, 16:00, 20:00) eng so'nggi AI trendlar,
 * Claude Code, Vibe Coding va Prompt Engineering bo'yicha maslahatlar yuboradi.
 */

const RssParser = require('rss-parser');
const axios = require('axios');

const parser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Aidevix-NewsBot/3.0' },
});

const RSS_FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'IT' },
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml', category: 'AI' },
];

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

/**
 * AI orqali trendlar va Prompt maslahatlar tayyorlash
 */
async function generateAIPost(item) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Siz Aidevix platformasining professional AI va Dasturlash bo'yicha Senior ekspertisiz. 
    Quyidagi yangilikni tahlil qiling va o'zbek tilida qiziqarli post tayyorlang.
    
    MAVZU YO'NALISHI: Claude Code, AI Agentlar, Vibe Coding, Prompt Engineering yoki eng so'nggi AI trendlar.
    
    Original Yangilik: ${item.title} - ${stripHtml(item.contentSnippet || '').substring(0, 400)}
    
    POST TUZILISHI:
    1. Catchy va "High-tech" o'zbekcha sarlavha.
    2. Yangilik haqida professional tahlil (Vibe coding yoki trendlar kontekstida).
    3. 💡 PROMPT TIP: Foydalanuvchi ushbu texnologiyadan foydalanishi uchun 1 ta amaliy prompt maslahati.
    
    Javobni FAQAT ushbu JSON formatda bering:
    {
      "title": "Trend sarlavha",
      "content": "Professional tahlil matni",
      "prompt_tip": "💡 Prompt maslahati matni"
    }`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('[News] AI Post generation error:', error.message);
    return null;
  }
}

async function fetchLatestNews() {
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      allItems.push(...(parsed.items || []).map(i => ({
        title: i.title,
        content: i.content,
        contentSnippet: i.contentSnippet,
        link: i.link,
        image: extractImage(i),
        pubDate: new Date(i.pubDate || Date.now())
      })));
    } catch (err) {}
  }
  return allItems.sort((a, b) => b.pubDate - a.pubDate);
}

async function postNewsToChannel() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
  if (!botToken || !channel) return false;

  try {
    const newsList = await fetchLatestNews();
    if (newsList.length === 0) return false;
    
    // Kunda 3 marta bo'lgani uchun har xil yangilik olish (time-based index)
    const now = new Date();
    const currentHour = (now.getUTCHours() + 5) % 24;
    let index = 0;
    if (currentHour >= 15) index = 1;
    if (currentHour >= 19) index = 2;
    
    const item = newsList[index] || newsList[0];
    const aiData = await generateAIPost(item);
    
    if (!aiData) return false;

    const message = 
      `🚀 <b>${aiData.title}</b>\n\n` +
      `${aiData.content}\n\n` +
      `${aiData.prompt_tip}\n\n` +
      `🔗 <a href="${item.link}">To'liq o'qish</a>\n\n` +
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
          { text: '💡', callback_data: 'news_react_bulb' }
        ],
        [
          { text: '📢 Do\'stlarga ulashish', url: `https://t.me/share/url?url=${encodeURIComponent(item.link)}&text=${encodeURIComponent(aiData.title)}` }
        ]
      ]
    };
    
    if (item.image) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        chat_id: chatId, 
        photo: item.image, 
        caption: message, 
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    } else {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId, 
        text: message, 
        parse_mode: 'HTML', 
        disable_web_page_preview: false,
        reply_markup: keyboard
      });
    }
    return true;
  } catch (error) {
    console.error('[News] Post error:', error.message);
    return false;
  }
}

function startNewsScheduler() {
  const enabled = process.env.NEWS_ENABLED === 'true' || process.env.SEND_NEWS === 'true';
  if (!enabled) return;

  const scheduleHours = [10, 16, 20]; // Kuniga 3 marta
  console.log(`[News] 📡 Kunlik 3 talik AI News ishga tushdi: ${scheduleHours.join(':00, ')}:00`);

  let lastPostedDatePlusHour = '';

  setInterval(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];
    const currentSlot = `${todayStr}-${tashkentHour}`;

    if (scheduleHours.includes(tashkentHour) && lastPostedDatePlusHour !== currentSlot) {
      lastPostedDatePlusHour = currentSlot;
      await postNewsToChannel();
    }
  }, 10 * 60 * 1000); // Har 10 daqiqada tekshirish

  // Server restart debug
  setTimeout(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];
    if (scheduleHours.some(h => tashkentHour >= h) && lastPostedDatePlusHour !== `${todayStr}-${tashkentHour}`) {
       // Manual postnews or restart-logic can be here
    }
  }, 5000);
}

module.exports = { startNewsScheduler, postNewsToChannel };
