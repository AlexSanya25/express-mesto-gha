/* eslint-disable import/extensions */
const User = require('../models/user.js');

const MestoProjectError = require('../utils/MestoProjectError.js');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

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
    const newUser = await User.create(req.body);
    return res.status(HttpCodesCards.create).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Переданы не валидные данные' });

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

const upUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const upUserProfile = await User.findByIdAndUpdate(
      req.user._id,
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
      req.user._id,
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  upUser,
  upUserAvatar,
};
