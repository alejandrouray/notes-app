require('dotenv').config();

const express = require('express');
const cors = require('cors');
const loggerMidleware = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

require('./mongo.js');

const PORT = process.env.PORT;
const app = express();

Sentry.init({
  dsn: 'https://1230f8a54c53428eb707dc3e1a1167bf@o1176449.ingest.sentry.io/6274267',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(cors());
app.use(express.static('../app/build'));
app.use(loggerMidleware);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app };
