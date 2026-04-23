/**
 * AIDEVIX SCHEDULER STATE
 *
 * Runtime on/off holati (server restart'da env ga qaytadi).
 * Bot /toggle buyrug'i shu moduldan foydalanadi.
 */

const state = {
  newsEnabled: process.env.NEWS_ENABLED === 'true' || process.env.SEND_NEWS === 'true',
  challengeEnabled: process.env.CHALLENGE_SCHEDULER_ENABLED !== 'false',
};

// So'nggi habarlar logi (RAM, max 50 ta)
const sentLog = [];
const MAX_LOG = 50;

function addLog(type, channelId, title, success) {
  sentLog.unshift({
    type,       // 'news' | 'challenge'
    channelId,
    title: title.substring(0, 80),
    success,
    ts: new Date(),
  });
  if (sentLog.length > MAX_LOG) sentLog.pop();
}

function getLogs(limit = 15) {
  return sentLog.slice(0, limit);
}

module.exports = {
  getState:             () => ({ ...state }),
  isNewsEnabled:        ()  => state.newsEnabled,
  isChallengeEnabled:   ()  => state.challengeEnabled,
  setNewsEnabled:       (v) => { state.newsEnabled = Boolean(v); },
  setChallengeEnabled:  (v) => { state.challengeEnabled = Boolean(v); },
  addLog,
  getLogs,
};
