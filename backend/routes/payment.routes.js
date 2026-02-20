const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/payment.controller');

// ✅ Add payment
router.post('/', ctrl.addPayment);

// ✅ Get payments by project
router.get('/project/:projectId', ctrl.getPaymentsByProject);

// ✅ Payment summary (balance + totals)
router.get('/summary/:projectId', ctrl.getPaymentSummary);

module.exports = router;
