const express = require('express');
const router = express.Router();
const {
  getPrompts,
  getFeaturedPrompts,
  getSavedPrompts,
  getSavedPromptIds,
  savePrompt,
  unsavePrompt,
  getPrompt,
  viewPrompt,
  createPrompt,
  likePrompt,
  deletePrompt,
  featurePrompt,
} = require('../controllers/promptController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const requireTelegramForPromptsRead = require('../middleware/requireTelegramForPrompts');

router.get('/', authenticate, requireTelegramForPromptsRead, getPrompts);
router.get('/featured', authenticate, requireTelegramForPromptsRead, getFeaturedPrompts);
router.get('/saved/me', authenticate, getSavedPrompts);
router.get('/saved/ids', authenticate, getSavedPromptIds);
router.post('/:id/save', authenticate, savePrompt);
router.delete('/:id/save', authenticate, unsavePrompt);
router.get('/:id', authenticate, requireTelegramForPromptsRead, getPrompt);
router.post('/:id/view', authenticate, requireTelegramForPromptsRead, viewPrompt);
router.post('/',          authenticate, createPrompt);
router.post('/:id/like',  authenticate, likePrompt);
router.delete('/:id',     authenticate, deletePrompt);
router.patch('/:id/feature', authenticate, requireAdmin, featurePrompt);

module.exports = router;
