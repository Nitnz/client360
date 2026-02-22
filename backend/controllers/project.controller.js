const Project = require('../models/project.model');
const { getExpiryStatus } = require('../utils/expiry.util');


// ================================
// ✅ Create Project
// ================================
exports.createProject = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const project = await Project.create(req.body);

    const formatted = {
      ...project.toObject(),
      expiryStatus: getExpiryStatus(project)
    };

    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ Get Expiring Projects
// default window = 7 days
// ================================
exports.getExpiringProjects = async (req, res) => {
  try {
    const days = Math.max(parseInt(req.query.days) || 7, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    const projects = await Project.find({
      $or: [
        { domainExpiry: { $gte: today, $lte: futureDate } },
        { hostingExpiry: { $gte: today, $lte: futureDate } }
      ]
    }).populate('client', 'name companyName email phone');

    const formatted = projects.map(project => ({
      ...project.toObject(),
      expiryStatus: getExpiryStatus(project)
    }));

    res.json({
      success: true,
      count: formatted.length,
      daysWindow: days,
      data: formatted
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ Get Projects by Client
// ================================
exports.getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const projects = await Project.find({ client: clientId })
      .populate('client', 'name companyName email phone');

    const formatted = projects.map(project => ({
      ...project.toObject(),
      expiryStatus: getExpiryStatus(project)
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ Get Single Project (NEW - IMPORTANT)
// ================================
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name companyName email phone');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const formatted = {
      ...project.toObject(),
      expiryStatus: getExpiryStatus(project)
    };

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Projects (for dropdowns)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name companyName')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ Update Project
// ================================
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
    ).populate('client', 'name companyName email phone');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const formatted = {
      ...project.toObject(),
      expiryStatus: getExpiryStatus(project)
    };

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
