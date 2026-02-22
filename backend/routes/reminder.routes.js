const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reminder.controller');

router.get('/', ctrl.getReminders);
router.post('/', ctrl.createReminder);
router.delete('/:id', ctrl.deleteReminder);

module.exports = router;