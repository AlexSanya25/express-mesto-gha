


const Router = require('express')
const userRouter = require('./users');


const router = Router();
router.use('/', userRouter);



module.exports = router