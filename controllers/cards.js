// eslint-disable-next-line import/extensions
const Card = require('../models/card.js');

// eslint-disable-next-line import/extensions
const MestoProjectError = require('../utils/MestoProjectError.js');
// eslint-disable-next-line import/no-unresolved, import/extensions
const NotValidIdError = require('../utils/NotValidIdError.js');

// eslint-disable-next-line import/extensions
const HttpCodesCards = require('../utils/constants.js');

// eslint-disable-next-line consistent-return
async function getCards(req, res, next) {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    next(error);
  }
}
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('owner').orFail(
      () => new MestoProjectError('Карточка по заданному ID не найдена'),
    );
    if (card.owner._id.toString() !== req.user._id.toString()) {
      throw new MestoProjectError('У вас нет прав на удаление данной карточки');
    }
    return res.status(HttpCodesCards.success).send(card);
  } catch (error) {
    if (error.name === 'MestoProjectError') {
      // eslint-disable-next-line no-undef
      next(new MestoProjectError('Карточка по заданному ID не найдена'));
    }
    if (error.name === 'CastError') {
      next(new NotValidIdError('Передан не валидный ID'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({ name, link, owner });
    return res.status(HttpCodesCards.create).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidIdError('Переданы не валидные данные'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const likeCard = async (req, res, next) => {
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
    if (error.name === 'MestoProjectError') {
      // eslint-disable-next-line no-undef
      next(new MestoProjectError('Карточка по заданному ID не найдена'));
    }
    if (error.name === 'CastError') {
      next(new NotValidIdError('Передан не валидный ID'));
    }
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const disLikeCard = async (req, res, next) => {
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
    if (error.name === 'MestoProjectError') {
      // eslint-disable-next-line no-undef
      next(new MestoProjectError('Карточка по заданному ID не найдена'));
    }
    if (error.name === 'CastError') {
      next(new NotValidIdError('Передан не валидный ID'));
    }
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};
