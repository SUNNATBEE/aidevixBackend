const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = `"Aidevix" <${process.env.EMAIL_USER}>`;

const sendWelcomeEmail = async (email, username) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Aidevix ga xush kelibsiz! 🎉',
    html: `
      <h2>Salom, ${username}!</h2>
      <p>Aidevix platformasiga xush kelibsiz! Endi kurslarni ko'rishingiz mumkin.</p>
      <p>Boshlash uchun: <a href="${process.env.FRONTEND_URL}/courses">Kurslarni ko'rish</a></p>
    `,
  });
};

const sendLevelUpEmail = async (email, username, level, rankTitle) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Tabriklaymiz! Siz ${level}-darajaga yetdingiz! 🏆`,
    html: `
      <h2>Tabriklaymiz, ${username}!</h2>
      <p>Siz <strong>${level}-darajaga</strong> yetdingiz!</p>
      <p>Yangi unvoningiz: <strong>${rankTitle}</strong></p>
      <p>Davom eting: <a href="${process.env.FRONTEND_URL}/leaderboard">Leaderboard</a></p>
    `,
  });
};

const sendCertificateEmail = async (email, username, courseName, certificateCode) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `Sertifikat: ${courseName} ✅`,
    html: `
      <h2>Tabriklaymiz, ${username}!</h2>
      <p>Siz <strong>${courseName}</strong> kursini muvaffaqiyatli tugatdingiz!</p>
      <p>Sertifikat kodi: <strong>${certificateCode}</strong></p>
      <p>Sertifikatni ko'rish: <a href="${process.env.FRONTEND_URL}/certificates/${certificateCode}">Bu yerda</a></p>
    `,
  });
};

const sendEnrollmentEmail = async (email, username, courseName) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `${courseName} kursiga yozildingiz! 📚`,
    html: `
      <h2>Salom, ${username}!</h2>
      <p>Siz <strong>${courseName}</strong> kursiga muvaffaqiyatli yozildingiz!</p>
      <p>O'qishni boshlash: <a href="${process.env.FRONTEND_URL}/courses">Kursga o'tish</a></p>
    `,
  });
};

async function sendEmailWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

const sendStreakReminderEmail = async (email, username, streak) => {
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#f97316;padding:32px;text-align:center">
      <div style="font-size:48px">🔥</div>
      <h1 style="color:#fff;margin:8px 0">Streak xavf ostida!</h1>
    </div>
    <div style="padding:32px">
      <p style="color:#475569;font-size:16px">Salom, <strong>${username}</strong>!</p>
      <p style="color:#475569">Sizning <strong style="color:#f97316">${streak} kunlik</strong> streak'ingiz xavf ostida. Bugun faol bo'lmasangiz, streak tugaydi!</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${process.env.FRONTEND_URL || 'https://aidevix.vercel.app'}" style="background:#6366f1;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">Platformaga kiring</a>
      </div>
    </div>
  </div>
</body>
</html>`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `🔥 ${streak} kunlik streak'ingizni saqlab qoling!`,
    html,
  }).catch(() => {});
};

const sendQuizResultEmail = async (email, username, quizTitle, score, passed) => {
  const color = passed ? '#22c55e' : '#ef4444';
  const icon = passed ? '🎉' : '💪';
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:${color};padding:32px;text-align:center">
      <div style="font-size:48px">${icon}</div>
      <h1 style="color:#fff;margin:8px 0">${passed ? 'Tabriklaymiz!' : 'Qayta urinib ko\'ring!'}</h1>
    </div>
    <div style="padding:32px">
      <p style="color:#475569">Salom, <strong>${username}</strong>!</p>
      <p style="color:#475569">"<strong>${quizTitle}</strong>" kvizini yakunladingiz.</p>
      <div style="background:#f1f5f9;border-radius:8px;padding:20px;text-align:center;margin:20px 0">
        <div style="font-size:48px;font-weight:bold;color:${color}">${score}%</div>
        <div style="color:#64748b">${passed ? 'O\'tdingiz!' : 'Minimum 70% kerak'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `${icon} Kviz natijasi: ${score}% — ${quizTitle}`,
    html,
  }).catch(() => {});
};

module.exports = {
  sendWelcomeEmail,
  sendLevelUpEmail,
  sendCertificateEmail,
  sendEnrollmentEmail,
  sendEmailWithRetry,
  sendStreakReminderEmail,
  sendQuizResultEmail,
};
