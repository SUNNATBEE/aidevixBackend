/**
 * ═══════════════════════════════════════════════════════════════════
 * AIDEVIX PROFESSIONAL NEWS SCHEDULER — AI Powered
 * ═══════════════════════════════════════════════════════════════════
 *
 * Kuniga 1 marta professional IT/AI yangilikni AI (Groq) orqali
 * o'zbek tiliga o'girib, rasm bilan @aidevix kanalga yuboradi.
 */

const RssParser = require('rss-parser');
const axios = require('axios');

const parser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Aidevix-NewsBot/2.0' },
});

const RSS_FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'IT' },
];

/**
 * Matndan rasm linkini ajratib olish
 */
function extractImage(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  
  const content = item.content || item.contentSnippet || '';
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  if (match && match[1]) return match[1];
  
  // Custom media tags check (for some RSS)
  if (item['media:content'] && item['media:content'].$) {
    return item['media:content'].$.url;
  }
  
  return null;
}

/**
 * HTML teglarni tozalash
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * AI orqali professional tarjima qilish (Groq Llama 3)
 */
async function translateWithAI(item) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('[News] GROQ_API_KEY topilmadi, tarjima qilinmadi.');
    return null;
  }

  try {
    const prompt = `Siz Aidevix platformasining professional IT jurnalistisiz. 
    Quyidagi yangilikni o'zbek tiliga professional, qiziqarli va "high-tech" uslubda o'girib bering.
    Faqat 1 ta eng muhim yangilik haqida gapiring.
    
    Inglizcha sarlavha: ${item.title}
    Inglizcha mazmuni: ${stripHtml(item.contentSnippet || item.content || '').substring(0, 500)}
    
    Javobni FAQAT quyidagi JSON formatda bering:
    {
      "uz_title": "O'zbekcha sarlavha",
      "uz_summary": "Professional o'zbekcha qisqacha mazmun (250-400 belgi)"
    }`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('[News] AI tarjima xatosi:', error.message);
    return null;
  }
}

/**
 * Yangiliklarni yig'ish
 */
async function fetchLatestNews() {
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).map(item => ({
        title: item.title,
        content: item.content,
        contentSnippet: item.contentSnippet,
        link: item.link,
        image: extractImage(item),
        source: feed.name,
        pubDate: new Date(item.pubDate || Date.now())
      }));
      allItems.push(...items);
    } catch (err) {
      console.error(`[News] ${feed.name} error:`, err.message);
    }
  }
  // Eng yangi va rasmga ega yangilikni tanlash
  return allItems
    .filter(i => i.image) // Rasmi borlarini afzal ko'ramiz
    .sort((a, b) => b.pubDate - a.pubDate);
}

/**
 * Kanalga yuborish
 */
async function postNewsToChannel() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
  
  if (!botToken || !channel) return false;

  try {
    const news = await fetchLatestNews();
    if (news.length === 0) return false;
    
    const item = news[0]; // Faqat 1 tasi
    const aiData = await translateWithAI(item);
    
    const title = aiData ? aiData.uz_title : item.title;
    const summary = aiData ? aiData.uz_summary : stripHtml(item.contentSnippet || '').substring(0, 200);

    const message = 
      `🔥 <b>${title}</b>\n\n` +
      `${summary}\n\n` +
      `🔗 <a href="${item.link}">Batafsil ma'lumot (EN)</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚀 <b>Aidevix</b> — Kelajak texnologiyalari markazi\n` +
      `🌐 <a href="https://aidevix.uz">aidevix.uz</a> | @aidevix_bot\n\n` +
      `#it #ai #texnologiya #yangiliklar`;

    const chatId = channel.startsWith('@') ? channel : `@${channel}`;

    // Rasm bilan yuborish
    if (item.image) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        chat_id: chatId,
        photo: item.image,
        caption: message,
        parse_mode: 'HTML'
      });
    } else {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
    }

    console.log('[News] ✅ Professional yangilik yuborildi');
    return true;
  } catch (error) {
    console.error('[News] Post xatosi:', error.response?.data || error.message);
    return false;
  }
}

function startNewsScheduler() {
  const enabled = process.env.NEWS_ENABLED === 'true' || process.env.SEND_NEWS === 'true';
  if (!enabled) return;

  const targetHour = parseInt(process.env.NEWS_HOUR) || 16;
  console.log(`[News] 📡 AI News Scheduler ishga tushdi — soat ${targetHour}:00`);

  let lastPostedDate = null;

  setInterval(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];

    if (tashkentHour === targetHour && lastPostedDate !== todayStr) {
      lastPostedDate = todayStr;
      await postNewsToChannel();
    }
  }, 15 * 60 * 1000); // Har 15 daqiqada tekshirish

  // Server restart debug
  setTimeout(async () => {
    const now = new Date();
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const todayStr = now.toISOString().split('T')[0];
    if (tashkentHour >= targetHour && lastPostedDate !== todayStr) {
       lastPostedDate = todayStr;
       console.log('[News] Professional yangilik yuborilmoqda...');
       await postNewsToChannel();
    }
  }, 10000);
}

module.exports = { startNewsScheduler, postNewsToChannel };
