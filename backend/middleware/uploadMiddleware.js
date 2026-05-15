const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Boot-time visibility — missing credentials would otherwise only surface as
// an opaque 500 the first time a user tries to upload a file. Logging here
// makes the misconfiguration obvious in Railway logs at startup.
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️  Cloudinary credentials missing — avatar/thumbnail uploads will fail with "Must supply api_key".');
  console.warn('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in the environment.');
}

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
