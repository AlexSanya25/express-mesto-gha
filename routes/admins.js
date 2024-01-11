const Router = require('express');
const {
  login,
  createUser,
// eslint-disable-next-line import/extensions, import/no-unresolved
} = require('../controllers/users.js');

const adminsRouter = Router();
adminsRouter.post('/signin', login);
adminsRouter.post('/signup', createUser);

module.exports = adminsRouter;
