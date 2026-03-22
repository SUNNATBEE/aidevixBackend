const PDFDocument = require('pdfkit');
const { cloudinary } = require('../middleware/uploadMiddleware');

/**
 * PDF sertifikat yaratish
 * @param {string} recipientName - O'quvchi ismi
 * @param {string} courseName - Kurs nomi
 * @param {Date} completedAt - Tugatilgan sana
 * @param {string} certificateCode - Sertifikat kodi
 * @returns {Promise<Buffer>} PDF buffer
 */
const generateCertificatePDF = (recipientName, courseName, completedAt, certificateCode) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 0,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width;
      const H = doc.page.height;
      const margin = 40;

      // Background — oq
      doc.rect(0, 0, W, H).fill('#FFFFFF');

      // Tashqi ramka (qo'sh chiziq)
      doc.lineWidth(3)
         .rect(margin, margin, W - margin * 2, H - margin * 2)
         .strokeColor('#6366f1')
         .stroke();

      doc.lineWidth(1)
         .rect(margin + 8, margin + 8, W - (margin + 8) * 2, H - (margin + 8) * 2)
         .strokeColor('#a5b4fc')
         .stroke();

      // Sarlavha: AIDEVIX
      doc.font('Helvetica-Bold')
         .fontSize(36)
         .fillColor('#6366f1')
         .text('AIDEVIX', 0, margin + 30, { align: 'center' });

      // Kichik sarlavha
      doc.font('Helvetica')
         .fontSize(11)
         .fillColor('#64748b')
         .text('Online Coding Platform', 0, margin + 75, { align: 'center' });

      // Divider
      doc.moveTo(W / 2 - 100, margin + 100)
         .lineTo(W / 2 + 100, margin + 100)
         .lineWidth(1)
         .strokeColor('#6366f1')
         .stroke();

      // SERTIFIKAT sarlavhasi
      doc.font('Helvetica-Bold')
         .fontSize(28)
         .fillColor('#1e293b')
         .text('SERTIFIKAT', 0, margin + 115, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(13)
         .fillColor('#475569')
         .text('CERTIFICATE OF COMPLETION', 0, margin + 150, { align: 'center' });

      // O'quvchi ismi
      doc.font('Helvetica-Bold')
         .fontSize(26)
         .fillColor('#6366f1')
         .text(recipientName, 0, margin + 190, { align: 'center' });

      // Matn
      doc.font('Helvetica')
         .fontSize(13)
         .fillColor('#374151')
         .text('muvaffaqiyatli tugatganligi uchun taqdim etiladi', 0, margin + 228, { align: 'center' });

      // Kurs nomi
      doc.font('Helvetica-Bold')
         .fontSize(18)
         .fillColor('#1e293b')
         .text(`"${courseName}"`, 0, margin + 258, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#6b7280')
         .text('kursi', 0, margin + 285, { align: 'center' });

      // Sana va kod — pastki qism
      const dateStr = new Date(completedAt).toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      doc.font('Helvetica')
         .fontSize(11)
         .fillColor('#9ca3af')
         .text(`Sana: ${dateStr}`, margin + 20, H - margin - 55)
         .text(`Sertifikat kodi: ${certificateCode}`, margin + 20, H - margin - 35);

      // O'ng tomonda imzo joyi
      doc.moveTo(W - margin - 150, H - margin - 60)
         .lineTo(W - margin - 20, H - margin - 60)
         .lineWidth(1)
         .strokeColor('#d1d5db')
         .stroke();

      doc.font('Helvetica')
         .fontSize(10)
         .fillColor('#9ca3af')
         .text('Muassasa rahbari', W - margin - 150, H - margin - 45, { width: 130, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * PDF ni Cloudinary ga yuklash
 * @param {Buffer} buffer - PDF buffer
 * @param {string} code - Sertifikat kodi
 * @returns {Promise<string>} Cloudinary URL
 */
const uploadCertificatePDF = async (buffer, code) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'aidevix/certificates',
        public_id: `certificate-${code}`,
        resource_type: 'raw',
        format: 'pdf',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

module.exports = { generateCertificatePDF, uploadCertificatePDF };
