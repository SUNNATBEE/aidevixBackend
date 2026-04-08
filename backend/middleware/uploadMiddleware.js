const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar upload storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'aidevix/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

// Thumbnail upload storage
const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'aidevix/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Faqat JPG, PNG, WEBP formatlar qabul qilinadi'), false);
  }
};

const uploadAvatar    = multer({ storage: avatarStorage,    fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
const uploadThumbnail = multer({ storage: thumbnailStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadAvatar, uploadThumbnail, cloudinary };
