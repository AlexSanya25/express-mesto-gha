const Router = require('express');

const userRouter = require('./users');

const cardRouter = require('./cards');

const adminsRouter = require('./admins');
const auth = require('../middlewares/auth');

const router = Router();
router.use('/', auth, userRouter);
router.use('/', auth, cardRouter);
router.use('/', adminsRouter);
/*
router.use('/users', auth, userRouter);
*/
module.exports = router;
