const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const router = require('./routes');
// eslint-disable-next-line import/extensions
const HttpCodesCards = require('./utils/constants.js');

// eslint-disable-next-line import/extensions
const NotFoundError = require('./utils/NotFoundError.js');

// eslint-disable-next-line import/extensions
const error = require('./utils/error.js')

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json());
/*
app.use((req, res, next) => {
  req.user = {
    // eslint-disable-next-line max-len
    _id: '657ec3ef46c8d88d9103fa5d',
  };
  next();
});
*/
app.use(router);

app.use('*', (err) => {
  throw new NotFoundError({ message: err.message });
});

// eslint-disable-next-line no-undef
app.use(error);
app.use(errors());
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
