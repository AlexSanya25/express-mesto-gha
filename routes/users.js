
const Router = require('express')
const {getUsers, getUserById, createUser, upUser, upUserAvatar} = require('../controllers/users.js')

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', upUser);
userRouter.patch('/users/me/avatar', upUserAvatar);


module.exports = userRouter
