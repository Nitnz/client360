const Note = require('../models/note.model');
const Client = require('../models/client.model');
const Project = require('../models/project.model');


// ✅ Add Note
exports.createNote = async (req, res) => {
  try {
    const { client, project, noteText } = req.body;

    // check client exists
    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // if project provided → validate
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    const note = await Note.create({
      client,
      project,
      noteText
    });

    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Notes by Client
exports.getNotesByClient = async (req, res) => {
  try {
    const notes = await Note.find({
      client: req.params.clientId
    })
      .populate('client', 'name companyName')
      .populate('project', 'projectName')
      .sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
