
const mongoose = require('mongoose');
const Note = require('../models/Note');
const User = require('../models/User');
const { api, initialNotes, userTest, getAllContentsFromNotes } = require('./helpers');

let userToken;

describe('notes tests', () => {
  beforeEach(async () => {
    await Note.deleteMany({});

    for (const note of initialNotes) {
      const noteObject = new Note(note);
      await noteObject.save();
    }

    const user = await api
      .post('/api/login')
      .send({
        username: 'aleroot',
        password: 'twitch'
      });

    userToken = `Bearer ${user._body.token}`;
  });

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two notes', async () => {
    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(initialNotes.length);
  });

  test('a least one note is about midudev', async () => {
    const { contents } = await getAllContentsFromNotes();
    expect(contents).toContain('content test midudev');
  });

  test('a valid note can be added', async () => {
    await User.deleteMany({ _id: { $ne: userTest.id } });

    const newNote = {
      content: 'Next async/await',
      important: true,
      userId: userTest.id
    };

    await api
      .post('/api/notes')
      .set('Authorization', userToken)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const { contents, res } = await getAllContentsFromNotes();

    expect(contents).toContain(newNote.content);
    expect(res.body).toHaveLength(initialNotes.length + 1);
  });

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    };

    await api
      .post('/api/notes')
      .set('Authorization', userToken)
      .send(newNote)
      .expect(400);

    const res = await api.get('/api/notes');

    expect(res.body).toHaveLength(initialNotes.length);
  });

  test('a note can be deleted', async () => {
    const { res: firstRes } = await getAllContentsFromNotes();
    const { body: notes } = firstRes;
    const noteToDelete = notes[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set('Authorization', userToken)
      .expect(204);

    const { contents, res: secondRes } = await getAllContentsFromNotes();

    expect(secondRes.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/1234')
      .set('Authorization', userToken)
      .expect(404);

    const { res } = await getAllContentsFromNotes();
    expect(res.body).toHaveLength(initialNotes.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
