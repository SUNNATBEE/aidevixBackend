const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587, // Number() is safer than parseInt() here
  secure: (Number(process.env.EMAIL_PORT) === 465), 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = `"Aidevix" <${process.env.EMAIL_USER || 'noreply@aidevix.uz'}>`;

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

const sendResetCodeEmail = async (email, username, code) => {
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05)">
    <div style="background:#6366f1;padding:40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">Parolni tiklash</h1>
    </div>
    <div style="padding:40px">
      <p style="color:#475569;font-size:16px">Salom, <strong>${username}</strong>!</p>
      <p style="color:#475569;font-size:16px">Hisobingiz parolini tiklash uchun quyidagi maxfiylik kodidan foydalaning:</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin:32px 0">
        <div style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#4f46e5">${code}</div>
        <p style="color:#64748b;font-size:13px;margin-top:12px">Kod 10 daqiqa davomida amal qiladi</p>
      </div>
      <p style="color:#64748b;font-size:14px">Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xabarga e'tibor bermang.</p>
    </div>
    <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0">
      <p style="color:#94a3b8;font-size:12px;margin:0">© 2024 Aidevix Learning Platform</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `🔐 Parolni tiklash kodi: ${code}`,
    html,
  });
};

const sendEmailVerificationCode = async (email, username, code) => {
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05)">
    <div style="background:#6366f1;padding:40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">Email manzilini tasdiqlang</h1>
    </div>
    <div style="padding:40px">
      <p style="color:#475569;font-size:16px">Salom, <strong>${username}</strong>!</p>
      <p style="color:#475569;font-size:16px">Aidevix hisobingizni aktivlashtirish uchun quyidagi kodni kiriting:</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin:32px 0">
        <div style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#4f46e5">${code}</div>
        <p style="color:#64748b;font-size:13px;margin-top:12px">Kod 15 daqiqa davomida amal qiladi</p>
      </div>
      <p style="color:#64748b;font-size:14px">Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu xabarga e'tibor bermang.</p>
    </div>
    <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0">
      <p style="color:#94a3b8;font-size:12px;margin:0">© 2024 Aidevix Learning Platform</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `✅ Email tasdiqlash kodi: ${code} — Aidevix`,
    html,
  });
};

const sendNewDeviceLoginEmail = async (email, username, { ip, ua, when }) => {
  const safeUa = String(ua || 'unknown').slice(0, 200).replace(/[<>]/g, '');
  const safeIp = String(ip || 'unknown').replace(/[<>]/g, '');
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#dc2626;padding:32px;text-align:center">
      <div style="font-size:48px">🛡️</div>
      <h1 style="color:#fff;margin:8px 0">Yangi qurilmadan kirish</h1>
    </div>
    <div style="padding:32px">
      <p style="color:#475569;font-size:16px">Salom, <strong>${username}</strong>!</p>
      <p style="color:#475569">Hisobingizga yangi qurilmadan kirilgan:</p>
      <table style="width:100%;background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;border-collapse:collapse">
        <tr><td style="padding:6px 12px;color:#64748b">Vaqt:</td><td style="padding:6px 12px;color:#0f172a"><strong>${when}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#64748b">IP:</td><td style="padding:6px 12px;color:#0f172a">${safeIp}</td></tr>
        <tr><td style="padding:6px 12px;color:#64748b">Brauzer / qurilma:</td><td style="padding:6px 12px;color:#0f172a">${safeUa}</td></tr>
      </table>
      <p style="color:#475569">Bu siz bo'lsangiz — e'tibor bermang. Bo'lmasa, <strong style="color:#dc2626">darhol parolingizni o'zgartiring</strong> va aktiv sessiyalarni tekshiring.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${process.env.FRONTEND_URL || 'https://aidevix.uz'}/profile/security" style="background:#6366f1;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none">Sessiyalarni boshqarish</a>
      </div>
    </div>
  </div>
</body>
</html>`;
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: '🛡️ Yangi qurilmadan Aidevix hisobiga kirish',
    html,
  }).catch(() => {});
};

const sendAccountDeletedEmail = async (email, username) => {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Aidevix hisob o\'chirildi',
    html: `
      <h2>Salom, ${username}!</h2>
      <p>Sizning Aidevix hisobingiz GDPR talabi asosida o'chirildi va anonimlashtirildi.</p>
      <p>Agar bu xato bo'lsa yoki yordam kerak bo'lsa, support@aidevix.uz ga murojaat qiling.</p>
    `,
  }).catch(() => {});
};

module.exports = {
  sendWelcomeEmail,
  sendEmailVerificationCode,
  sendLevelUpEmail,
  sendCertificateEmail,
  sendEnrollmentEmail,
  sendEmailWithRetry,
  sendStreakReminderEmail,
  sendQuizResultEmail,
  sendResetCodeEmail,
  sendNewDeviceLoginEmail,
  sendAccountDeletedEmail,
};
