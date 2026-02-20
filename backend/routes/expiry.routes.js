const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expiry.controller');

// GET /api/expiry?days=30
router.get('/', ctrl.getUpcomingExpiries);

module.exports = router;
