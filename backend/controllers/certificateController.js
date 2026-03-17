const Certificate = require('../models/Certificate');

/** @desc  Mening sertifikatlarim | @route GET /api/certificates/my | @access Private */
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail category')
      .sort({ issuedAt: -1 });

    res.json({ success: true, data: { certificates: certs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Sertifikatni code bo'yicha tekshirish (ochiq) | @route GET /api/certificates/verify/:code | @access Public */
const verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateCode: req.params.code })
      .populate('userId', 'username')
      .populate('courseId', 'title category');

    if (!cert)
      return res.status(404).json({ success: false, message: 'Sertifikat topilmadi yoki noto\'g\'ri kod' });

    res.json({
      success: true,
      data: {
        valid: true,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        issuedAt: cert.issuedAt,
        code: cert.certificateCode,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMyCertificates, verifyCertificate };
