const Video = require('../models/Video');
const Course = require('../models/Course');
const VideoLink = require('../models/VideoLink');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

// Get all videos for a course
const getCourseVideos = async (req, res) => {
  try {
    const { courseId } = req.params;

    const videos = await Video.find({ 
      course: courseId, 
      isActive: true 
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        videos,
        count: videos.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching videos.',
      error: error.message,
    });
  }
};

// Get single video (requires subscription check)
const getVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id).populate('course');

    if (!video || !video.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    // User subscription status is already checked by middleware
    // But we do a final check here as well for extra security
    const user = req.user;
    const hasAllSubscriptions = user.hasAllSubscriptions();
    
    if (!hasAllSubscriptions) {
      const missingSubscriptions = [];
      if (!user.socialSubscriptions.instagram.subscribed) {
        missingSubscriptions.push('Instagram');
      }
      if (!user.socialSubscriptions.telegram.subscribed) {
        missingSubscriptions.push('Telegram');
      }

      return res.status(403).json({
        success: false,
        message: `Siz obuna bekor qildingiz. Video ko'ra olmaysiz. Iltimos, ${missingSubscriptions.join(' va ')} ga qayta obuna bo'ling.`,
        subscriptions: {
          instagram: user.socialSubscriptions.instagram.subscribed,
          telegram: user.socialSubscriptions.telegram.subscribed,
        },
        missingSubscriptions,
      });
    }

    // Check if user already has a video link
    let videoLink = await VideoLink.findOne({
      user: user._id,
      video: video._id,
      isUsed: false,
    });

    // If no link exists or all links are used, create a new one
    if (!videoLink) {
      // Generate Telegram private channel link
      // In production, you would generate this based on your Telegram channel setup
      const telegramLink = generateTelegramVideoLink(video._id, user._id);

      videoLink = await VideoLink.create({
        video: video._id,
        user: user._id,
        telegramLink,
      });
    }

    res.json({
      success: true,
      data: {
        video: {
          id: video._id,
          title: video.title,
          description: video.description,
          duration: video.duration,
          course: video.course,
        },
        videoLink: {
          id: videoLink._id,
          telegramLink: videoLink.telegramLink,
          isUsed: videoLink.isUsed,
          expiresAt: videoLink.expiresAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching video.',
      error: error.message,
    });
  }
};

// Generate Telegram video link
const generateTelegramVideoLink = (videoId, userId) => {
  // This should generate a unique one-time link to your Telegram private channel
  // You can use a service like t.me/yourchannel?start=unique_token
  // Or use Telegram Bot API to create invite links
  
  const uniqueToken = `${videoId}_${userId}_${Date.now()}`;
  // Use private channel for video links (different from subscription channel)
  const privateChannelUsername = process.env.TELEGRAM_PRIVATE_CHANNEL_USERNAME || process.env.TELEGRAM_CHANNEL_USERNAME || 'yourchannel';
  
  // Return a unique link that can be verified when accessed
  return `https://t.me/${privateChannelUsername}?start=${Buffer.from(uniqueToken).toString('base64')}`;
};

// Use video link (mark as used when accessed)
// This function checks subscription status in real-time before allowing access
const useVideoLink = async (req, res) => {
  try {
    const { linkId } = req.params;

    const videoLink = await VideoLink.findById(linkId).populate('user');

    if (!videoLink) {
      return res.status(404).json({
        success: false,
        message: 'Video link not found.',
      });
    }

    // Check if link belongs to user
    if (videoLink.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to use this link.',
      });
    }

    // Check if already used
    if (videoLink.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'This video link has already been used.',
      });
    }

    // Check expiration
    if (videoLink.expiresAt && new Date() > videoLink.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'This video link has expired.',
      });
    }

    // IMPORTANT: Real-time subscription check before allowing video access
    const User = require('../models/User');
    const { 
      checkInstagramSubscriptionRealTime, 
      checkTelegramSubscriptionRealTime 
    } = require('../utils/socialVerification');

    const user = await User.findById(req.user._id);
    
    // Real-time check Instagram subscription
    let instagramSubscribed = false;
    if (user.socialSubscriptions.instagram.username) {
      instagramSubscribed = await checkInstagramSubscriptionRealTime(
        user.socialSubscriptions.instagram.username,
        user._id
      );
      
      // Update if changed
      if (user.socialSubscriptions.instagram.subscribed !== instagramSubscribed) {
        user.socialSubscriptions.instagram.subscribed = instagramSubscribed;
        user.socialSubscriptions.instagram.verifiedAt = instagramSubscribed ? new Date() : null;
      }
    }

    // Real-time check Telegram subscription
    let telegramSubscribed = false;
    if (user.socialSubscriptions.telegram.username) {
      const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;
      const telegramUserId = user.socialSubscriptions.telegram.telegramUserId || null;
      
      if (telegramUserId && channelUsername) {
        telegramSubscribed = await checkTelegramSubscriptionRealTime(
          telegramUserId,
          channelUsername
        );
      } else {
        telegramSubscribed = user.socialSubscriptions.telegram.subscribed;
      }
      
      // Update if changed
      if (user.socialSubscriptions.telegram.subscribed !== telegramSubscribed) {
        user.socialSubscriptions.telegram.subscribed = telegramSubscribed;
        user.socialSubscriptions.telegram.verifiedAt = telegramSubscribed ? new Date() : null;
      }
    } else {
      telegramSubscribed = user.socialSubscriptions.telegram.subscribed;
    }

    // Save subscription status changes
    await user.save();

    // If user unsubscribed, block video access
    if (!instagramSubscribed || !telegramSubscribed) {
      const missingSubscriptions = [];
      if (!instagramSubscribed) missingSubscriptions.push('Instagram');
      if (!telegramSubscribed) missingSubscriptions.push('Telegram');

      return res.status(403).json({
        success: false,
        message: `Siz obuna bekor qildingiz. Video ko'ra olmaysiz. Iltimos, ${missingSubscriptions.join(' va ')} ga qayta obuna bo'ling.`,
        subscriptions: {
          instagram: instagramSubscribed,
          telegram: telegramSubscribed,
        },
        missingSubscriptions,
      });
    }

    // All checks passed - mark link as used
    videoLink.isUsed = true;
    videoLink.usedAt = new Date();
    await videoLink.save();

    res.json({
      success: true,
      message: 'Video link used successfully.',
      data: {
        videoLink,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error using video link.',
      error: error.message,
    });
  }
};

// Create video (Admin only)
const createVideo = async (req, res) => {
  try {
    const { title, description, courseId, order, duration, thumbnail } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and courseId.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const video = await Video.create({
      title,
      description,
      course: courseId,
      order: order || 0,
      duration: duration || 0,
      thumbnail,
    });

    // Add video to course
    course.videos.push(video._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Video created successfully.',
      data: {
        video,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating video.',
      error: error.message,
    });
  }
};

// Update video (Admin only)
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, duration, thumbnail, isActive } = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    // Update fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (order !== undefined) video.order = order;
    if (duration !== undefined) video.duration = duration;
    if (thumbnail) video.thumbnail = thumbnail;
    if (isActive !== undefined) video.isActive = isActive;

    await video.save();

    res.json({
      success: true,
      message: 'Video updated successfully.',
      data: {
        video,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating video.',
      error: error.message,
    });
  }
};

// Delete video (Admin only)
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    await video.deleteOne();

    res.json({
      success: true,
      message: 'Video deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting video.',
      error: error.message,
    });
  }
};

module.exports = {
  getCourseVideos,
  getVideo,
  useVideoLink,
  createVideo,
  updateVideo,
  deleteVideo,
};
