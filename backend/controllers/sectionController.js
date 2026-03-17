const Section = require('../models/Section');
const Video   = require('../models/Video');

/** @desc  Kurs bo'limlarini olish | @route GET /api/sections/course/:courseId | @access Public */
const getCourseSections = async (req, res) => {
  try {
    const sections = await Section.find({ courseId: req.params.courseId, isActive: true })
      .populate({ path: 'videos', match: { isActive: true }, select: 'title duration order thumbnail', options: { sort: { order: 1 } } })
      .sort({ order: 1 });

    res.json({ success: true, data: { sections } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Bo'lim yaratish (Admin) | @route POST /api/sections | @access Admin */
const createSection = async (req, res) => {
  try {
    const { courseId, title, description, order } = req.body;
    if (!courseId || !title)
      return res.status(400).json({ success: false, message: 'courseId va title majburiy' });

    const section = await Section.create({ courseId, title, description, order: order || 0 });
    res.status(201).json({ success: true, message: 'Bo\'lim yaratildi', data: { section } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Bo'limga video qo'shish (Admin) | @route POST /api/sections/:sectionId/videos/:videoId | @access Admin */
const addVideoToSection = async (req, res) => {
  try {
    const { sectionId, videoId } = req.params;
    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Bo\'lim topilmadi' });

    if (!section.videos.includes(videoId)) section.videos.push(videoId);
    await section.save();
    await Video.findByIdAndUpdate(videoId, { sectionId });

    res.json({ success: true, message: 'Video bo\'limga qo\'shildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Bo'limni yangilash (Admin) | @route PUT /api/sections/:id | @access Admin */
const updateSection = async (req, res) => {
  try {
    const allowed = ['title', 'description', 'order', 'isActive'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

    const section = await Section.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!section) return res.status(404).json({ success: false, message: 'Bo\'lim topilmadi' });

    res.json({ success: true, message: 'Bo\'lim yangilandi', data: { section } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Bo'limni o'chirish (Admin) | @route DELETE /api/sections/:id | @access Admin */
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Bo\'lim topilmadi' });

    res.json({ success: true, message: 'Bo\'lim o\'chirildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCourseSections, createSection, addVideoToSection, updateSection, deleteSection };
