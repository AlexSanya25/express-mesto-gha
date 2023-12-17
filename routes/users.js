
const Router = require('express')
const {getUsers, getUserById, createUser} = require('../controllers/users.js')

const userRouter = Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
module.exports = userRouter
