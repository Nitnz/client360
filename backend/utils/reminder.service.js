const Reminder = require('../models/reminder.model');
const Project = require('../models/project.model');
const Payment = require('../models/payment.model');

/**
 * 🧠 Generate reminders for:
 * - domain expiry
 * - hosting expiry
 * - pending payment
 */
exports.generateReminders = async () => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const projects = await Project.find();

    for (const project of projects) {
      // ===============================
      // 🌐 DOMAIN REMINDER
      // ===============================
      if (
        project.domainExpiry &&
        project.domainExpiry >= today &&
        project.domainExpiry <= nextWeek
      ) {
        await createReminderIfNotExists({
          projectId: project._id,
          type: 'domain',
          remindDate: project.domainExpiry,
          message: `Domain expiring for project ${project.projectName}`
        });
      }

      // ===============================
      // 🖥 HOSTING REMINDER
      // ===============================
      if (
        project.hostingExpiry &&
        project.hostingExpiry >= today &&
        project.hostingExpiry <= nextWeek
      ) {
        await createReminderIfNotExists({
          projectId: project._id,
          type: 'hosting',
          remindDate: project.hostingExpiry,
          message: `Hosting expiring for project ${project.projectName}`
        });
      }

      // ===============================
      // 💰 PAYMENT REMINDER
      // ===============================
      const payments = await Payment.find({ projectId: project._id });

      const totalPaid = payments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const balance = project.cost - totalPaid;

      if (balance > 0) {
        await createReminderIfNotExists({
          projectId: project._id,
          type: 'payment',
          remindDate: today,
          message: `Pending payment ₹${balance} for project ${project.projectName}`
        });
      }
    }

    console.log('✅ Reminder generation completed');
  } catch (error) {
    console.error('❌ Reminder service error:', error.message);
  }
};

/**
 * 🔒 Prevent duplicate reminders
 */
async function createReminderIfNotExists({
  projectId,
  type,
  remindDate,
  message
}) {
  const exists = await Reminder.findOne({
    project: projectId,
    type,
    sent: false
  });

  if (!exists) {
    await Reminder.create({
      project: projectId,
      type,
      remindDate,
      message
    });
  }
}
