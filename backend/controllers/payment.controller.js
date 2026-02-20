const Payment = require('../models/payment.model');
const Project = require('../models/project.model');


// 🔹 Helper: calculate totals
const calculateSummary = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const payments = await Payment.find({ projectId });

  const totalPaid = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const balance = project.cost - totalPaid;

  return {
    projectCost: project.cost,
    totalPaid,
    balance
  };
};


// ✅ Add Payment
exports.addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Payments by Project
exports.getPaymentsByProject = async (req, res) => {
  try {
    const payments = await Payment.find({
      projectId: req.params.projectId
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Payment Summary (main business logic)
exports.getPaymentSummary = async (req, res) => {
  try {
    const summary = await calculateSummary(req.params.projectId);

    if (!summary) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ (Optional alias for compatibility)
exports.getProjectBalance = exports.getPaymentSummary;
