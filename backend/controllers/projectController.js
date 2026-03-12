const Project  = require('../models/Project');
const UserStats = require('../models/UserStats');

/**
 * @desc  Kurs uchun barcha loyihalar
 * @route GET /api/projects/course/:courseId
 * @access Public
 */
const getProjectsByCourse = async (req, res) => {
  try {
    const projects = await Project.find({
      courseId: req.params.courseId,
      isActive: true,
    }).sort({ order: 1 });

    // Agar foydalanuvchi login bo'lsa, bajarilganini belgilash
    const userId = req.user?._id?.toString();

    const result = projects.map((p) => {
      const pObj = p.toObject();
      if (userId) {
        pObj.isCompleted = p.completedBy.some(
          (c) => c.userId.toString() === userId,
        );
      }
      // Kimlar bajarganini yashirish (shaxsiy ma'lumot)
      delete pObj.completedBy;
      return pObj;
    });

    res.json({ success: true, data: { projects: result } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Bitta loyiha tafsiloti
 * @route GET /api/projects/:id
 * @access Public
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('courseId', 'title category');
    if (!project || !project.isActive) {
      return res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
    }

    const pObj = project.toObject();
    const userId = req.user?._id?.toString();
    if (userId) {
      pObj.isCompleted = project.completedBy.some(
        (c) => c.userId.toString() === userId,
      );
    }
    delete pObj.completedBy;

    res.json({ success: true, data: { project: pObj } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Loyihani bajarildi deb belgilash va XP berish
 * @route POST /api/projects/:id/complete
 * @access Private
 */
const completeProject = async (req, res) => {
  try {
    const { githubUrl } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project || !project.isActive) {
      return res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
    }

    const userId = req.user._id;
    const alreadyDone = project.completedBy.some(
      (c) => c.userId.toString() === userId.toString(),
    );

    if (alreadyDone) {
      return res.status(400).json({
        success: false,
        message: 'Bu loyihani allaqachon bajargansiz',
      });
    }

    // completedBy ga qo'shish
    project.completedBy.push({ userId, githubUrl, completedAt: new Date() });
    await project.save();

    // XP berish
    let stats = await UserStats.findOne({ userId });
    if (!stats) stats = await UserStats.create({ userId });

    stats.xp += project.xpReward;
    stats.level = stats.calculateLevel();
    stats.lastActivityDate = new Date();
    await stats.save();

    res.json({
      success: true,
      message: 'Loyiha bajarildi! XP qo\'shildi.',
      data: {
        xpEarned: project.xpReward,
        totalXp: stats.xp,
        level: stats.level,
        levelProgress: stats.getLevelProgress(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin CRUD ─────────────────────────────────────────────────────────────

/**
 * @desc  Yangi loyiha yaratish (Admin)
 * @route POST /api/projects
 * @access Admin
 */
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: { project } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Loyihani yangilash (Admin)
 * @route PUT /api/projects/:id
 * @access Admin
 */
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!project) return res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
    res.json({ success: true, data: { project } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Loyihani o'chirish (Admin)
 * @route DELETE /api/projects/:id
 * @access Admin
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!project) return res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
    res.json({ success: true, message: 'Loyiha o\'chirildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProjectsByCourse,
  getProject,
  completeProject,
  createProject,
  updateProject,
  deleteProject,
};
