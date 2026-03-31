const UserStats = require('../models/UserStats');
const Course = require('../models/Course');
const User = require('../models/User');

/** @desc  Avatar yuklash | @route POST /api/upload/avatar | @access Private */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Rasm tanlanmadi yoki turi noto\'g\'ri' });

    const avatarUrl = req.file.path || req.file.url; // Cloudinary returns path or url
    const userId = req.user._id || req.user.id;

    // 1. UserStats modelini yangilash
    await UserStats.findOneAndUpdate(
      { userId },
      { avatar: avatarUrl },
      { upsert: true, new: true }
    );

    // 2. Asosiy User modelini ham yangilash (sinxron bo'lishi uchun)
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.json({ 
      success: true, 
      message: 'Avatar muvaffaqiyatli yangilandi', 
      data: { avatarUrl } 
    });
  } catch (err) {
    console.error('❌ AVATAR UPLOAD ERROR:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Avatar yuklashda xatolik yuz berdi: ' + err.message 
    });
  }
};

/** @desc  Kurs thumbnail yuklash (Admin) | @route POST /api/upload/thumbnail/:courseId | @access Admin */
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Rasm tanlanmadi' });

    const thumbnailUrl = req.file.path;
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { thumbnail: thumbnailUrl },
      { new: true },
    );

    if (!course) return res.status(404).json({ success: false, message: 'Kurs topilmadi' });

    res.json({ success: true, message: 'Thumbnail yangilandi', data: { thumbnailUrl } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadAvatar, uploadThumbnail };
