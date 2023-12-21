// eslint-disable-next-line import/extensions
const Card = require('../models/card.js');

// eslint-disable-next-line import/extensions
const MestoProjectError = require('../utils/MestoProjectError.js');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(HttpCodesCards.serverErr).send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(
      () => new MestoProjectError('Карточка по заданному ID не найдена'),
    );
    return res.status(HttpCodesCards.success).send(card);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Передан не валидный ID' });
      case 'MestoProjectError':
        return res.status(error.statusCode).send(error.message);

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    return res.status(HttpCodesCards.create).send(newCard);
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

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail(
      () => new MestoProjectError('Карточка по заданному ID не найдена'),
    );
    return res.status(HttpCodesCards.create).send(like);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Передан не валидный ID' });
      case 'MestoProjectError':
        return res.status(error.statusCode).send(error.message);

      default:
        return res
          .status(HttpCodesCards.serverErr)
          .send({ message: 'Ошибка на стороне сервера', error: error.message });
    }
  }
};

const disLikeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail(
      () => new MestoProjectError('Карточка по заданному ID не найдена'),
    );
    return res.status(HttpCodesCards.create).send(like);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res.status(HttpCodesCards.notFoundId).send({ message: 'Передан не валидный ID' });
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
