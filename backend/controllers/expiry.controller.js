const Project = require('../models/project.model');

// Get projects with expiring domain/hosting within X days
exports.getUpcomingExpiries = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const projects = await Project.find({
      $or: [
        { domainExpiry: { $gte: today, $lte: futureDate } },
        { hostingExpiry: { $gte: today, $lte: futureDate } }
      ]
    }).populate('client', 'name email');

    res.json({
      count: projects.length,
      projects
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch expiries' });
  }
};
