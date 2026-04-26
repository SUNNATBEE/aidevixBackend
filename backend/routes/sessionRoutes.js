const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  listMySessions,
  revokeSession,
  revokeOtherSessions,
} = require('../controllers/sessionController');

router.get('/', authenticate, listMySessions);
router.delete('/', authenticate, revokeOtherSessions);
router.delete('/:id', authenticate, revokeSession);

module.exports = router;
