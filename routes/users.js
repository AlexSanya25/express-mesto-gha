const Router = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate } = require('celebrate');
const {
  getUsers,
  getUserById,
  upUser,
  upUserAvatar,
  getUsersMe,
// eslint-disable-next-line import/extensions
} = require('../controllers/users.js');

// eslint-disable-next-line import/extensions
const { upUserJoi, upAvatarJoi, userIdJoi } = require('../joi/joi.js');

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.patch('/users/me', celebrate(upUserJoi), upUser);
userRouter.get('/users/me', celebrate(userIdJoi), getUsersMe);
userRouter.get('/users/:userId', celebrate(userIdJoi), getUserById);
userRouter.patch('/users/me/avatar', celebrate(upAvatarJoi), upUserAvatar);

module.exports = userRouter;
