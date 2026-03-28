const mongoose = require('mongoose');

module.exports = function () {
  return function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid ID format.' });
    }
    next();
  };
};
