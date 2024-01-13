const Router = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
// eslint-disable-next-line import/extensions
} = require('../controllers/cards.js');

// eslint-disable-next-line import/extensions
const { createCardJoi, cardIdJoi } = require('../joi/joi.js');

const cardRouter = Router();
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate(createCardJoi), createCard);
cardRouter.delete('/cards/:cardId', celebrate(cardIdJoi), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate(cardIdJoi), likeCard);
cardRouter.delete('/cards/:cardId/likes', celebrate(cardIdJoi), disLikeCard);

module.exports = cardRouter;
