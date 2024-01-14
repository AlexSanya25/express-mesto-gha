class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = 'Такой страницы не существует';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
