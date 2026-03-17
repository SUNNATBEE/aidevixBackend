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

module.exports = {
  sendWelcomeEmail,
  sendLevelUpEmail,
  sendCertificateEmail,
  sendEnrollmentEmail,
};
