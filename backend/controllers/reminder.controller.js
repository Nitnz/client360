const Project = require('../models/project.model');
const Payment = require('../models/payment.model');

exports.getReminders = async (req, res) => {
  try {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    // ✅ Expiring Domains
    const expiringDomains = await Project.find({
      domainExpiry: { $gte: today, $lte: next7Days }
    }).select('projectName domainName domainExpiry client');

    // ✅ Expiring Hosting
    const expiringHosting = await Project.find({
      hostingExpiry: { $gte: today, $lte: next7Days }
    }).select('projectName hostingExpiry client');

    // ✅ Pending Payments
    const projects = await Project.find();

    const pendingPayments = [];

    for (const project of projects) {
      const payments = await Payment.find({
        projectId: project._id
      });

      const totalPaid = payments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const balance = project.cost - totalPaid;

      if (balance > 0) {
        pendingPayments.push({
          projectId: project._id,
          projectName: project.projectName,
          client: project.client,
          projectCost: project.cost,
          totalPaid,
          balance
        });
      }
    }

    res.json({
      expiringDomains,
      expiringHosting,
      pendingPayments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
