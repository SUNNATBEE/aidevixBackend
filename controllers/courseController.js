const Course = require('../models/Course');
const Video = require('../models/Video');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('instructor', 'username email')
      .populate('videos', 'title description order duration')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        courses,
        count: courses.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
      error: error.message,
    });
  }
};

// Get single course
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('instructor', 'username email')
      .populate('videos', 'title description order duration thumbnail');

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course.',
      error: error.message,
    });
  }
};

// Create course (Admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price, category } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and price.',
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      category: category || 'general',
      instructor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: {
        course,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course.',
      error: error.message,
    });
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, price, category, isActive } = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (thumbnail) course.thumbnail = thumbnail;
    if (price !== undefined) course.price = price;
    if (category) course.category = category;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully.',
      data: {
        course,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course.',
      error: error.message,
    });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
