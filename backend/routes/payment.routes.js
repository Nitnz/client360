const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/payment.controller');

// Add payment
router.post('/', ctrl.addPayment);

// Get payments by project
router.get('/project/:projectId', ctrl.getPaymentsByProject);

// Summary
router.get('/summary/:projectId', ctrl.getPaymentSummary);

// Balance
router.get('/balance/:projectId', ctrl.getProjectBalance);

// ✅ DELETE — this was missing
router.delete('/:id', ctrl.deletePayment);




module.exports = router;