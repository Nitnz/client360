const Client = require('../models/client.model');

exports.createClient = async (req, res) => {   
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const Project = require('../models/project.model');
    const projectCount = await Project.countDocuments({ client: req.params.id });

    if (projectCount > 0) {
      return res.status(400).json({
        message: `This client has ${projectCount} project(s). Please delete all projects first before deleting the client.`
      });
    }

    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
