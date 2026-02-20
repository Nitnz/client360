const Client = require('../models/client.model');
const Project = require('../models/project.model');
const Payment = require('../models/payment.model');

exports.getDashboardStats = async (req, res) => {
  try {
    // ✅ counts
    const totalClients = await Client.countDocuments();
    const totalProjects = await Project.countDocuments();

    // ✅ total revenue
    const payments = await Payment.find();
    const totalRevenue = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // ✅ pending amount
    const projects = await Project.find();
    let pendingAmount = 0;

    for (const project of projects) {
      const projectPayments = await Payment.find({
        projectId: project._id
      });

      const paid = projectPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      pendingAmount += (project.cost - paid);
    }

    // ✅ expiry calculation (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const expiringDomains = await Project.countDocuments({
      $or: [
        { domainExpiry: { $gte: today, $lte: nextWeek } },
        { hostingExpiry: { $gte: today, $lte: nextWeek } }
      ]
    });

    res.json({
      totalClients,
      totalProjects,
      totalRevenue,
      pendingAmount,
      expiringDomains
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
