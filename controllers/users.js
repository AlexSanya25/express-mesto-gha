// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const bcrypt = require('bcrypt');

/* eslint-disable import/extensions */
const User = require('../models/user.js');

const MestoProjectError = require('../utils/MestoProjectError.js');
// eslint-disable-next-line import/no-unresolved
const NotValidIdError = require('../utils/NotValidIdError.js');
const ConflictError = require('../utils/ConflictError.js');
// eslint-disable-next-line import/extensions
const NotAuthorizate = require('../utils/NotAuthorizate.js');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

const generateToken = require('../utils/jwt.js');

// eslint-disable-next-line consistent-return
async function getUsers(req, res, next) {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    // eslint-disable-next-line no-undef
    next(err);
  }
}

// eslint-disable-next-line consistent-return
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new MestoProjectError('Пользователь по заданному ID не найден'),
    );
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    if (error.name === 'MestoProjectError') {
      // eslint-disable-next-line no-undef
      next(new MestoProjectError('Пользователь по заданному ID не найден'));
    }
    if (error.name === 'CastError') {
      next(new NotValidIdError('Передан не валидный ID'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = req.body.toString();
    const soltRounds = 10;
    const hash = await bcrypt.hash(password, soltRounds);
    const newUser = await User.create({ email, password: hash });
    return res.status(HttpCodesCards.create).send({
      // eslint-disable-next-line max-len
      name: newUser.name, about: newUser.about, avatar: newUser.avatar, email: newUser.email, id: newUser._id,
    });
  } catch (error) {
    if (error.code === HttpCodesCards.dublicate) {
      // eslint-disable-next-line no-undef
      next(new ConflictError('Такой пользователь уже существует'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const upUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const upUserProfile = await User.findByIdAndUpdate(
      req.body._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserProfile);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidIdError('Переданы не валидные данные'));
    }
    if (error.name === 'MestoProjectError') {
      next(new MestoProjectError('Пользователь по заданному ID не найден'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const upUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const upUserAvatr = await User.findByIdAndUpdate(
      req.body._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserAvatr);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidIdError('Переданы не валидные данные'));
    }
    if (error.name === 'MestoProjectError') {
      next(new MestoProjectError('Пользователь по заданному ID не найден'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  const { email } = req.body;
  const password = req.body.toString();
  try {
    const userAdmin = await User.findOne({ email }).select('+password').orFail(
      () => new Error('NotAuthantificate'),
    );
    const matched = await bcrypt.compare(password, userAdmin.password);
    if (!matched) {
      throw new Error('NotAuthantificate');
    }

    const token = generateToken({ _id: userAdmin._id });
    return res.status(HttpCodesCards.success).send({ userAdmin, token });
  } catch (error) {
    if (error.message === 'NotAuthantificate') {
      next(new NotAuthorizate('Неверно введены данные'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const getUsersMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    if (!user) {
      throw new NotValidIdError('User not found');
    }
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    if (error.message === 'User not found') {
      next(new NotValidIdError('Переданы не валидные данные'));
    }
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  upUser,
  upUserAvatar,
  login,
  getUsersMe,
};
