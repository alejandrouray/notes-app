const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');
const userExtractor = require('../middlewares/userExtractor');
const Mongoose = require('mongoose');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  });
  res.json(notes);
});

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body;
  const user = await User.findById(req.userId);

  if (!content) {
    return res.status(400).json({
      error: 'note or note.content is missing'
    });
  }

  const newNote = new Note({
    content,
    important,
    date: new Date().toISOString(),
    user: user._id
  });

  try {
    const savedNote = await newNote.save();

    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then(note =>
      note
        ? res.json(note)
        : res.status(404).end()
    ).catch(next);
});

notesRouter.put('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params;
  const { content, important } = req.body;

  const newNoteInfo = {
    content,
    important
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(note => res.json(note))
    .catch(next);
});

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params;

  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = notesRouter;
