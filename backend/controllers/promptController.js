const Prompt = require('../models/Prompt');
const UserStats = require('../models/UserStats');

/** @route GET /api/prompts | @access Public */
const getPrompts = async (req, res) => {
  try {
    const { category, tool, sort = 'newest', page = 1, limit = 20, search } = req.query;
    const filter = { isPublic: true };

    if (category && category !== 'all') filter.category = category;
    if (tool && tool !== 'all') filter.tool = tool;
    if (search) filter.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      popular: { likesCount: -1 },
      views: { viewsCount: -1 },
    };

    const prompts = await Prompt.find(filter)
      .populate('author', 'username firstName avatar aiStack')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Prompt.countDocuments(filter);

    res.json({ success: true, data: { prompts, total, page: +page, pages: Math.ceil(total / +limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route GET /api/prompts/featured | @access Public */
const getFeaturedPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ isFeatured: true, isPublic: true })
      .populate('author', 'username firstName avatar')
      .sort({ likesCount: -1 })
      .limit(6);
    res.json({ success: true, data: prompts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route GET /api/prompts/:id | @access Public */
const getPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('author', 'username firstName avatar aiStack rankTitle');

    if (!prompt) return res.status(404).json({ success: false, message: 'Prompt topilmadi' });
    res.json({ success: true, data: prompt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route POST /api/prompts/:id/view | @access Public */
const viewPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
    if (!prompt) return res.status(404).json({ success: false, message: 'Prompt topilmadi' });
    return res.json({ success: true, viewsCount: prompt.viewsCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** @route POST /api/prompts | @access Private */
const createPrompt = async (req, res) => {
  try {
    const { title, content, description, category, tool, tags } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'title va content majburiy' });

    const prompt = await Prompt.create({
      title, content, description, category, tool,
      tags: (tags || []).slice(0, 5),
      author: req.user._id,
    });

    // Prompt yaratgani uchun XP +30
    await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { $inc: { xp: 30, weeklyXp: 30 } }
    );

    await prompt.populate('author', 'username firstName avatar');
    res.status(201).json({ success: true, message: 'Prompt yaratildi! +30 XP', data: prompt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route POST /api/prompts/:id/like | @access Private */
const likePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ success: false, message: 'Prompt topilmadi' });

    const userId = req.user._id.toString();
    const alreadyLiked = prompt.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      prompt.likes = prompt.likes.filter(id => id.toString() !== userId);
      prompt.likesCount = Math.max(0, prompt.likesCount - 1);
    } else {
      prompt.likes.push(req.user._id);
      prompt.likesCount += 1;
    }

    await prompt.save();
    res.json({ success: true, liked: !alreadyLiked, likesCount: prompt.likesCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route DELETE /api/prompts/:id | @access Private (owner or admin) */
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ success: false, message: 'Prompt topilmadi' });

    const isOwner = prompt.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Ruxsat yo\'q' });

    await prompt.deleteOne();
    res.json({ success: true, message: 'Prompt o\'chirildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @route PATCH /api/prompts/:id/feature | @access Admin */
const featurePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { isFeatured: req.body.featured ?? true },
      { new: true }
    );
    if (!prompt) return res.status(404).json({ success: false, message: 'Prompt topilmadi' });
    res.json({ success: true, data: prompt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPrompts, getFeaturedPrompts, getPrompt, viewPrompt, createPrompt, likePrompt, deletePrompt, featurePrompt };
