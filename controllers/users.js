// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const bcrypt = require('bcrypt');

/* eslint-disable import/extensions */
const User = require('../models/user.js');

// eslint-disable-next-line import/no-unresolved
const NotValidIdError = require('../utils/NotValidIdError.js');
const ConflictError = require('../utils/ConflictError.js');
// eslint-disable-next-line import/extensions
const NotAuthorizate = require('../utils/NotAuthorizate.js');
const NotFoundError = require('../utils/NotFoundError.js');

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
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      // eslint-disable-next-line no-undef
      next(new NotFoundError('Пользователь по заданному ID не найден'));
      // eslint-disable-next-line consistent-return
      return;
    }
    if (error.name === 'CastError') {
      next(new NotValidIdError('Передан не валидный ID'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const soltRounds = 10;
    const hash = await bcrypt.hash(password, soltRounds);
    // eslint-disable-next-line no-dupe-keys
    const newUser = await User.create({ email, password: hash });
    return res.status(HttpCodesCards.create).send({
      // eslint-disable-next-line max-len
      name: newUser.name, about: newUser.about, avatar: newUser.avatar, email: newUser.email, id: newUser._id,
    });
  } catch (error) {
    if (error.code === HttpCodesCards.dublicate) {
      // eslint-disable-next-line no-undef
      next(new ConflictError('Такой пользователь уже существует'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const upUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const upUserProfile = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserProfile);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidIdError('Переданы не валидные данные'));
      // eslint-disable-next-line consistent-return
      return;
    }
    if (error.name === 'NotFoundError') {
      next(new NotFoundError('Пользователь по заданному ID не найден'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const upUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const upUserAvatr = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserAvatr);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidIdError('Переданы не валидные данные'));
      // eslint-disable-next-line consistent-return
      return;
    }
    if (error.name === 'NotFoundError') {
      next(new NotFoundError('Пользователь по заданному ID не найден'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAdmin = await User.findOne({ email }).select('+password').orFail(
      () => new Error('NotAuthantificate'),
    );
    const matched = await bcrypt.compare(password, userAdmin.password);
    if (!matched) {
      throw new Error('NotAuthantificate');
    }

    const token = generateToken({ _id: userAdmin._id });
    return res.status(HttpCodesCards.success).send(
      {
        // eslint-disable-next-line max-len
        name: userAdmin.name, about: userAdmin.about, avatar: userAdmin.avatar, email: userAdmin.email, id: userAdmin._id, token,
      },
    );
  } catch (error) {
    if (error.message === 'NotAuthantificate') {
      next(new NotAuthorizate('Неверно введены данные'));
      // eslint-disable-next-line consistent-return
      return;
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const getUsersMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new NotValidIdError('User not found');
    }
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    if (error.message === 'User not found') {
      next(new NotValidIdError('Переданы не валидные данные'));
      // eslint-disable-next-line consistent-return
      return;
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
