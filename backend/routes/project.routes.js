const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/project.controller');

// Create project
router.post('/', ctrl.createProject);

// Get projects by client
router.get('/client/:clientId', ctrl.getProjectsByClient);

// Update project
router.put('/:id', ctrl.updateProject);

// Expiring projects
router.get('/expiring', ctrl.getExpiringProjects);

// Delete project
router.delete('/:id', ctrl.deleteProject);

module.exports = router;
