const Wishlist = require('../models/Wishlist');
const Course   = require('../models/Course');

/** @desc  Wishlistga kurs qo'shish | @route POST /api/wishlist/:courseId | @access Private */
const addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Kurs topilmadi' });

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user._id, courses: [] });

    const exists = wishlist.courses.find(c => c.courseId.toString() === courseId);
    if (exists) return res.status(400).json({ success: false, message: 'Kurs allaqachon wishlistda' });

    wishlist.courses.push({ courseId });
    await wishlist.save();

    res.json({ success: true, message: 'Kurs wishlistga qo\'shildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Wishlistdan o'chirish | @route DELETE /api/wishlist/:courseId | @access Private */
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist bo\'sh' });

    wishlist.courses = wishlist.courses.filter(c => c.courseId.toString() !== req.params.courseId);
    await wishlist.save();

    res.json({ success: true, message: 'Kurs wishlistdan olib tashlandi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Mening wishlistim | @route GET /api/wishlist | @access Private */
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate({ path: 'courses.courseId', select: 'title thumbnail category level rating price isFree instructor', populate: { path: 'instructor', select: 'username jobTitle' } });

    res.json({ success: true, data: { courses: wishlist ? wishlist.courses : [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
