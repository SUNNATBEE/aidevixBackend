const Course = require('../models/Course');
const Video  = require('../models/Video');

/**
 * @desc  Barcha kurslar — filter, qidiruv, pagination
 * @route GET /api/courses?category=react&search=...&level=beginner&sort=popular&page=1&limit=12
 * @access Public
 */
const getAllCourses = async (req, res) => {
  try {
    const {
      category,
      search,
      level,
      sort    = 'newest',
      page    = 1,
      limit   = 12,
      isFree,
    } = req.query;

    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (level) filter.level = level;
    if (isFree !== undefined) filter.isFree = isFree === 'true';
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      oldest:     { createdAt: 1 },
      popular:    { viewCount: -1 },
      rating:     { rating: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate('instructor', 'username email jobTitle position')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-videos');

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          total,
          page:  parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Top kurslar (eng ko'p ko'rilgan)
 * @route GET /api/courses/top?limit=6&category=react
 * @access Public
 */
const getTopCourses = async (req, res) => {
  try {
    const limit    = parseInt(req.query.limit) || 6;
    const category = req.query.category || null;

    const filter = { isActive: true };
    if (category) filter.category = category;

    const courses = await Course.find(filter)
      .populate('instructor', 'username email')
      .sort({ viewCount: -1, rating: -1 })
      .limit(limit)
      .select('-videos');

    res.json({ success: true, data: { courses } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Mavjud kategoriyalar va kurslar soni
 * @route GET /api/courses/categories
 * @access Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.map((c) => ({ name: c._id, count: c.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Bitta kurs to'liq ma'lumoti (videolar va loyihalar bilan)
 * @route GET /api/courses/:id
 * @access Public
 */
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username email jobTitle position')
      .populate({
        path:   'videos',
        match:  { isActive: true },
        select: 'title description order duration thumbnail',
        options: { sort: { order: 1 } },
      });

    if (!course || !course.isActive) {
      return res.status(404).json({ success: false, message: 'Kurs topilmadi' });
    }

    // Ko'rishlar sonini oshirish (background'da)
    Course.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

    res.json({ success: true, data: { course } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Tavsiya etilgan kurslar — xuddi shu kategoriyadan, eng yuqori reytingli
 * @route GET /api/courses/:id/recommended?limit=4
 * @access Public
 */
const getRecommendedCourses = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('category');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Kurs topilmadi' });
    }

    const limit = parseInt(req.query.limit) || 4;

    const courses = await Course.find({
      isActive: true,
      category: course.category,
      _id: { $ne: req.params.id },
    })
      .populate('instructor', 'username email jobTitle position')
      .sort({ rating: -1, viewCount: -1 })
      .limit(limit)
      .select('-videos');

    res.json({ success: true, data: { courses } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Yangi kurs yaratish (Admin)
 * @route POST /api/courses
 * @access Admin
 */
const createCourse = async (req, res) => {
  try {
    const {
      title, description, thumbnail, price, category,
      level, isFree, rating, ratingCount, studentsCount,
    } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'title, description va price majburiy maydonlar',
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail:     thumbnail || null,
      price,
      category:      category || 'general',
      level:         level || 'beginner',
      isFree:        isFree || false,
      rating:        rating || 0,
      ratingCount:   ratingCount || 0,
      studentsCount: studentsCount || 0,
      instructor:    req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Kurs muvaffaqiyatli yaratildi',
      data: { course },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Kursni yangilash (Admin)
 * @route PUT /api/courses/:id
 * @access Admin
 */
const updateCourse = async (req, res) => {
  try {
    const allowed = [
      'title', 'description', 'thumbnail', 'price', 'category',
      'level', 'isFree', 'isActive', 'rating', 'ratingCount', 'studentsCount',
    ];

    const update = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true },
    );

    if (!course) return res.status(404).json({ success: false, message: 'Kurs topilmadi' });

    res.json({ success: true, message: 'Kurs yangilandi', data: { course } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc  Kursni o'chirish (Admin)
 * @route DELETE /api/courses/:id
 * @access Admin
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Kurs topilmadi' });

    await course.deleteOne();
    res.json({ success: true, message: 'Kurs o\'chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  getTopCourses,
  getCategories,
  getRecommendedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
