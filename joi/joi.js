// eslint-disable-next-line import/no-extraneous-dependencies
const { Joi } = require('celebrate');

const createCardJoi = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
};

const cardIdJoi = {
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
};

const signUpJoi = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const signInJoi = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const upUserJoi = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const upAvatarJoi = {
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
};

module.exports = {
  createCardJoi,
  cardIdJoi,
  signUpJoi,
  signInJoi,
  upUserJoi,
  upAvatarJoi,
};
