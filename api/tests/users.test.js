const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const { api, getUsers, userTest } = require('./helpers');

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({ _id: { $ne: userTest.id } });

    const passwordHash = await bcrypt.hash('pswd', 10);
    const user = new User({
      username: 'aleroot2',
      passwordHash
    });

    await user.save();
  });

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers();

    const newUser = {
      username: 'midudev',
      name: 'Miguel',
      password: 'twitch'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await getUsers();
    const usernames = usersAtEnd.map(u => u.username);

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers();
    const newUser = {
      username: 'aleroot',
      name: 'Miguel',
      password: 'twitch'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.errors.username.message).toContain('`username` to be unique');

    const usersAtEnd = await getUsers();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
