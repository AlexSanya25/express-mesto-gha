module.exports = class MestoProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MestoProjectError';
    this.statusCode = 404;
    this.message = { message };
  }
};
