// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const bcrypt = require('bcrypt');

/* eslint-disable import/extensions */
const User = require('../models/user.js');

const MestoProjectError = require('../utils/MestoProjectError.js');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

const generateToken = require('../utils/jwt.js');

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new MestoProjectError('Пользователь по заданному ID не найден'),
    );
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Передан не валидный ID' });
      case 'MestoProjectError':
        return res.status(error.statusCode).send({ message: error.message });

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const password = req.body.toString();
    const soltRounds = 10;
    const hash = await bcrypt.hash(password, soltRounds);
    const newUser = await User.create({ email, password: hash });
    return res.status(HttpCodesCards.create).send(newUser);
  } catch (error) {
    if (error.code === HttpCodesCards.dublicate) {
      return res.status(HttpCodesCards.conflict).send({ message: 'Такой пользователь уже существует' });
    }
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const upUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const upUserProfile = await User.findByIdAndUpdate(
      req.body._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserProfile);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Переданы не валидные данные' });
      case 'MestoProjectError':
        return res.status(error.statusCode).send(error.message);

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

const upUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const upUserAvatr = await User.findByIdAndUpdate(
      req.body._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodesCards.create).send(upUserAvatr);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Переданы не валидные данные' });
      case 'MestoProjectError':
        return res.status(error.statusCode).send(error.message);

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res) => {
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
      return res.status(HttpCodesCards.mismatchErr).send({ message: 'Неверный адрес или пароль' });
    }
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const getUsersMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    if (!user) {
      throw new Error('User not found');
    }
    return res.status(HttpCodesCards.success).send(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(HttpCodesCards.notFoundId).send({ message: 'Передан не валидный ID' });
    }
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
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
