const Payment = require('../models/payment.model');
const Project = require('../models/project.model');


// ✅ Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { projectId, amount, type, method, note } = req.body;

    const payment = await Payment.create({
      project: projectId,
      amount,
      type,
      method,
      note
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Payments by Project
exports.getPaymentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const payments = await Payment.find({ project: projectId })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Payment Summary (IMPORTANT FOR DASHBOARD)
exports.getPaymentSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const payments = await Payment.find({ project: projectId });

    const totalPaid = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const totalCost = project.cost || 0;
    const pendingAmount = totalCost - totalPaid;

    res.json({
      totalCost,
      totalPaid,
      pendingAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Project Balance (simple number)
exports.getProjectBalance = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    const payments = await Payment.find({ project: projectId });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = (project.cost || 0) - totalPaid;

    res.json({ balance });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};