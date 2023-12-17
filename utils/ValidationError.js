module.exports = class ValidationError extends Error {
 constructor(message) {
  super();
  this.name = 'ValidationError'
  this.statusCode = 404;
  this.message = {message};
 }
}