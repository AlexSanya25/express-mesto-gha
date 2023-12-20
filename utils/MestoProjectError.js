// eslint-disable-next-line import/extensions
const HttpCodesCards = require('./constants.js');

module.exports = class MestoProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MestoProjectError';
    this.statusCode = HttpCodesCards.notFoundErr;
  }
};
