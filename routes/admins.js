const Router = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate } = require('celebrate');
const {
  login,
  createUser,
// eslint-disable-next-line import/extensions, import/no-unresolved
} = require('../controllers/users.js');

// eslint-disable-next-line import/extensions
const { signUpJoi, signInJoi } = require('../joi/joi.js');

const adminsRouter = Router();
adminsRouter.post('/signin', celebrate(signInJoi), login);
adminsRouter.post('/signup', celebrate(signUpJoi), createUser);

module.exports = adminsRouter;
