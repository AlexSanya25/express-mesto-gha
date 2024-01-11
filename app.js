const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('./utils/constants.js');

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

app.use((req, res, next) => {
  res.status(HttpCodesCards.notFoundErr).send({ message: 'Такого маршрута не существует' });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
