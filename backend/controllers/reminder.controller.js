const Project = require('../models/project.model');
const Payment = require('../models/payment.model');
const Reminder = require('../models/reminder.model');

exports.getReminders = async (req, res) => {
  try {
    const today = new Date();
    const soon = new Date(); soon.setDate(today.getDate() + 7);
    const autoReminders = [];

    const projects = await Project.find().populate('client', 'name');

    for (const p of projects) {
      const clientName = p.client?.name || 'Unknown';

      if (p.domainExpiry && new Date(p.domainExpiry) < today)
        autoReminders.push({ type: 'DOMAIN_EXPIRED', projectName: p.projectName, clientName, expiryDate: p.domainExpiry, auto: true });
      else if (p.domainExpiry && new Date(p.domainExpiry) <= soon)
        autoReminders.push({ type: 'DOMAIN_EXPIRING', projectName: p.projectName, clientName, expiryDate: p.domainExpiry, auto: true });

      if (p.hostingExpiry && new Date(p.hostingExpiry) < today)
        autoReminders.push({ type: 'HOSTING_EXPIRED', projectName: p.projectName, clientName, expiryDate: p.hostingExpiry, auto: true });
      else if (p.hostingExpiry && new Date(p.hostingExpiry) <= soon)
        autoReminders.push({ type: 'HOSTING_EXPIRING', projectName: p.projectName, clientName, expiryDate: p.hostingExpiry, auto: true });

      const payments = await Payment.find({ project: p._id });
      const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
      const balance = p.cost - totalPaid;
      if (balance > 0)
        autoReminders.push({ type: 'PAYMENT_PENDING', projectName: p.projectName, clientName, balance, auto: true });
    }

    const manualReminders = await Reminder.find().sort({ createdAt: -1 });
    res.json([...autoReminders, ...manualReminders]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
