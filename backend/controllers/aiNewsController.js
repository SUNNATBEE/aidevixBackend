const AiNews = require('../models/AiNews');

const PUBLIC_LIMIT = 12;

const toDateOrNull = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getPublicAiNews = async (_req, res) => {
  try {
    const now = new Date();
    const news = await AiNews.find({
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gt: now } }] },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(PUBLIC_LIMIT)
      .lean();
    return res.json({ success: true, data: { news } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const listAiNewsAdmin = async (_req, res) => {
  try {
    const news = await AiNews.find().sort({ order: 1, createdAt: -1 }).lean();
    return res.json({ success: true, data: { news } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createAiNewsAdmin = async (req, res) => {
  try {
    const { title, summary, imageUrl, platform, href, cta, order, isActive, startsAt, endsAt } = req.body;
    if (!title || !summary || !href) {
      return res.status(400).json({ success: false, message: 'title, summary va href majburiy' });
    }

    const startsAtDate = toDateOrNull(startsAt);
    const endsAtDate = toDateOrNull(endsAt);
    if (startsAtDate && endsAtDate && endsAtDate <= startsAtDate) {
      return res.status(400).json({ success: false, message: 'endsAt startsAt dan katta bo‘lishi kerak' });
    }

    const item = await AiNews.create({
      title: String(title).trim(),
      summary: String(summary).trim(),
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      platform: platform === 'instagram' ? 'instagram' : 'telegram',
      href: String(href).trim(),
      cta: cta ? String(cta).trim() : "To'liq yangilikni ko'rish",
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      isActive: isActive !== false,
      startsAt: startsAtDate,
      endsAt: endsAtDate,
    });

    return res.status(201).json({ success: true, data: { item } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateAiNewsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = {};
    const allowed = ['title', 'summary', 'imageUrl', 'platform', 'href', 'cta', 'order', 'isActive', 'startsAt', 'endsAt'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (patch.platform && patch.platform !== 'telegram' && patch.platform !== 'instagram') {
      patch.platform = 'telegram';
    }
    if (patch.order !== undefined) patch.order = Number(patch.order) || 0;
    if (patch.startsAt !== undefined) patch.startsAt = toDateOrNull(patch.startsAt);
    if (patch.endsAt !== undefined) patch.endsAt = toDateOrNull(patch.endsAt);

    const current = await AiNews.findById(id).select('startsAt endsAt');
    if (!current) return res.status(404).json({ success: false, message: 'Yangilik topilmadi' });
    const nextStartsAt = patch.startsAt !== undefined ? patch.startsAt : current.startsAt;
    const nextEndsAt = patch.endsAt !== undefined ? patch.endsAt : current.endsAt;
    if (nextStartsAt && nextEndsAt && nextEndsAt <= nextStartsAt) {
      return res.status(400).json({ success: false, message: 'endsAt startsAt dan katta bo‘lishi kerak' });
    }

    const item = await AiNews.findByIdAndUpdate(id, patch, { new: true });
    return res.json({ success: true, data: { item } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAiNewsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await AiNews.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ success: false, message: 'Yangilik topilmadi' });
    return res.json({ success: true, message: "AI yangilik o'chirildi" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const trackAiNewsClick = async (req, res) => {
  try {
    const { id } = req.params;
    await AiNews.updateOne({ _id: id }, { $inc: { clicks: 1 } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPublicAiNews,
  listAiNewsAdmin,
  createAiNewsAdmin,
  updateAiNewsAdmin,
  deleteAiNewsAdmin,
  trackAiNewsClick,
};
