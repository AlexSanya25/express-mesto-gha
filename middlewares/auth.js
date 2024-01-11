const jwt = require('jsonwebtoken');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

// eslint-disable-next-line func-names, consistent-return
module.exports = function (req, res, next) {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('NotAutantificate');
    }
    const validToken = token.replace('Bearer ', '');
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(validToken, 'dev_secret');
  } catch (error) {
    if (error.message === 'NotAuthantificate') {
      return res.status(HttpCodesCards.mismatchErr).send({ message: 'С токеном что-то не так' });
    }
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
  req.user = payload;
  next();
};
