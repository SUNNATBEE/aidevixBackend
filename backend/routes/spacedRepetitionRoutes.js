const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { getDueCards, gradeCard } = require('../controllers/spacedRepetitionController');

router.get('/due', authenticate, getDueCards);
router.post('/:cardId/grade', authenticate, validateObjectId('cardId'), gradeCard);

module.exports = router;
