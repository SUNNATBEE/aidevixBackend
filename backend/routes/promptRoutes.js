const express = require('express');
const router = express.Router();
const {
  getPrompts, getFeaturedPrompts, getPrompt,
  createPrompt, likePrompt, deletePrompt, featurePrompt,
} = require('../controllers/promptController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',           getPrompts);
router.get('/featured',   getFeaturedPrompts);
router.get('/:id',        getPrompt);
router.post('/',          authenticate, createPrompt);
router.post('/:id/like',  authenticate, likePrompt);
router.delete('/:id',     authenticate, deletePrompt);
router.patch('/:id/feature', authenticate, requireAdmin, featurePrompt);

module.exports = router;
