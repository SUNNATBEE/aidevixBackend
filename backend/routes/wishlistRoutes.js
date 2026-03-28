const express = require('express');
const router  = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getWishlist);
router.post('/:courseId',   authenticate, addToWishlist);
router.delete('/:courseId', authenticate, removeFromWishlist);

module.exports = router;
