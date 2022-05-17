const supertest = require('supertest');
const { app, server } = require('../index');
const User = require('../models/User');

const api = supertest(app);

const initialNotes = [
  {
    content: 'content test midudev',
    important: true,
    date: new Date()
  },
  {
    content: 'content test',
    important: true,
    date: new Date()
  },
  {
    content: 'third note',
    important: false,
    date: new Date()
  }
];

const userTest = {
  id: '628258101865b915c05cd3b7'
};

const getAllContentsFromNotes = async () => {
  const res = await api.get('/api/notes');
  return {
    res,
    contents: res.body.map(n => n.content)
  };
};

const getUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  api,
  initialNotes,
  userTest,
  getAllContentsFromNotes,
  getUsers,
  server
};
