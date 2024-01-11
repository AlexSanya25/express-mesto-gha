const Router = require('express');
const {
  getUsers,
  getUserById,
  upUser,
  upUserAvatar,
  getUsersMe,
// eslint-disable-next-line import/extensions
} = require('../controllers/users.js');

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.patch('/users/me', upUser);
userRouter.get('/users/me', getUsersMe);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me/avatar', upUserAvatar);

module.exports = userRouter;
