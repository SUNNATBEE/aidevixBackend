const mongoose = require('mongoose');

/**
 * MongoDB ObjectId format validatsiyasi middleware
 * @param {string} paramName - req.params dan tekshiriladigan kalit nomi (default: 'id')
 */
function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ success: false, message: "Noto'g'ri ID format" });
    }
    next();
  };
}

module.exports = validateObjectId;
