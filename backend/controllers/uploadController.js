const UserStats = require('../models/UserStats');
const Course    = require('../models/Course');

/** @desc  Avatar yuklash | @route POST /api/upload/avatar | @access Private */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Rasm tanlanmadi' });

    const avatarUrl = req.file.path; // Cloudinary URL

    await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { avatar: avatarUrl },
      { upsert: true },
    );

    res.json({ success: true, message: 'Avatar yangilandi', data: { avatarUrl } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
