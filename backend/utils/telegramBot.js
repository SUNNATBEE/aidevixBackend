const axios = require('axios');

class SimpleBot {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
    this.offset = 0;
    this.isPolling = false;
  }

  async startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    console.log('🤖 Telegram bot is polling for /start and /id commands...');
    this.poll();
  }

  async poll() {
    if (!this.isPolling) return;

    try {
      const response = await axios.get(`${this.apiUrl}/getUpdates`, {
        params: {
          offset: this.offset,
          timeout: 30
        },
        // axios request timeout must be greater than polling timeout
        timeout: 35000 
      });

      if (response.data && response.data.ok) {
        const updates = response.data.result;
        
        for (const update of updates) {
          this.offset = update.update_id + 1;
          this.handleUpdate(update);
        }
      }
    } catch (error) {
      // Ignore timeout errors, log others
      if (error.code !== 'ECONNABORTED' && !error.message.includes('timeout')) {
        console.error('Telegram bot polling error:', error.message);
      }
    }

    // Schedule next poll
    if (this.isPolling) {
      setTimeout(() => this.poll(), 500);
    }
  }

  async handleUpdate(update) {
    // Agar oddiy xabar kelsa
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const firstName = update.message.from.first_name || 'Foydalanuvchi';
      
      // Frontend URL ni o'qish, topilmasa standart Aidevix uz domeni
      const frontendUrls = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim());
      const validFrontendUrl = frontendUrls.find(u => u.startsWith('https://')) || 'https://aidevix.uz';

      if (text.startsWith('/start') || text.startsWith('/id')) {
        const message = 
          `👋 <b>Assalomu alaykum, ${firstName}!</b>\n\n` +
          `🚀 <b>Aidevix</b> — eng tez rivojlanayotgan <b>IT-ta'lim</b> platformasiga xush kelibsiz!\n\n` +
          `🔹 Sizning shaxsiy Telegram ID raqamingiz: <code>${userId}</code>\n\n` +
          `<i>Ushbu ID raqam orqali siz platformamizdagi obunangizni tasdiqlaysiz va bepul darslarni ko'rish imkoniyatiga ega bo'lasiz.</i>`;
        
        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '🌐 Saytga kirish (Mini App)', web_app: { url: validFrontendUrl } }
            ],
            [
              { text: '🆔 ID raqamni ko\'rish', callback_data: 'get_my_id' },
              { text: '📢 Rasmiy kanal', url: 'https://t.me/aidevix' }
            ]
          ]
        };

        await this.sendMessage(chatId, message, { 
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        });
      }
    } 
    // Agar inline tugma (callback_query) bosilsa
    else if (update.callback_query) {
      const query = update.callback_query;
      const userId = query.from.id;
      
      if (query.data === 'get_my_id') {
        const alertMsg = `🆔 Sizning Telegram ID raqamingiz: ${userId}\n\nSaytdagi "Telegram ID ni kiriting" maydoniga shuni yozing.`;
        await this.answerCallbackQuery(query.id, alertMsg, true);
      }
    }
  }

  async answerCallbackQuery(callbackQueryId, text, showAlert = false) {
    try {
      await axios.post(`${this.apiUrl}/answerCallbackQuery`, {
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: showAlert
      });
    } catch (error) {
      console.error('Failed to answer callback query:', error.message);
    }
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text: text,
        ...options
      });
    } catch (error) {
      console.error('Failed to send telegram message:', error.message);
    }
  }
}

const initTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN topilmadi. Telegram bot ishga tushmaydi.');
    return;
  }

  const bot = new SimpleBot(token);
  // Kutmasdan ishga tushirib yuboramiz
  bot.startPolling().catch(err => console.error('Bot polling startup error:', err));
};

module.exports = { initTelegramBot };
