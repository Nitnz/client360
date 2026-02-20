const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/note.controller');

// Create note
router.post('/', ctrl.createNote);

// Get notes by client
router.get('/client/:clientId', ctrl.getNotesByClient);

// Delete note
router.delete('/:id', ctrl.deleteNote);

module.exports = router;
