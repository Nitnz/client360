const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', ctrl.registerUser);
router.post('/login', ctrl.loginUser);

// Example protected route
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
