const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const router = require('./routes');

// eslint-disable-next-line import/extensions
const NotFoundError = require('./utils/NotFoundError.js');

// eslint-disable-next-line import/extensions
const error = require('./utils/error.js');

const { requestLogger, errorLogger } = require('./middlewares/logger');
// eslint-disable-next-line import/extensions
const cors = require('./middlewares/cors.js');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(cors);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

// eslint-disable-next-line no-undef
app.use(error);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
