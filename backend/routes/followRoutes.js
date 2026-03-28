const express = require('express');
const router  = express.Router();
const { followUser, unfollowUser, getFollowStats, getMyFollowers, getMyFollowing } = require('../controllers/followController');
const { authenticate } = require('../middleware/auth');

router.post('/:userId',   authenticate, followUser);
router.delete('/:userId', authenticate, unfollowUser);
router.get('/:userId/stats', getFollowStats);
router.get('/my/followers', authenticate, getMyFollowers);
router.get('/my/following', authenticate, getMyFollowing);

module.exports = router;
