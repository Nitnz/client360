const cron = require('node-cron');
const Project = require('../models/project.model');

// ⏰ Runs every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('🔔 Running expiry check...');

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const projects = await Project.find({
      $or: [
        { domainExpiry: { $gte: today, $lte: nextWeek } },
        { hostingExpiry: { $gte: today, $lte: nextWeek } }
      ]
    }).populate('client', 'name email companyName');

    if (!projects.length) {
      console.log('✅ No expiring projects');
      return;
    }

    console.log(`⚠️ Found ${projects.length} expiring projects`);

    for (const project of projects) {
      console.log(`
🚨 EXPIRY ALERT
Client: ${project.client?.name}
Project: ${project.projectName}
Domain Expiry: ${project.domainExpiry}
Hosting Expiry: ${project.hostingExpiry}
      `);
    }

  } catch (error) {
    console.error('❌ Expiry cron error:', error.message);
  }
});
