/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

// eslint-disable-next-line import/extensions
const { regexUrl, regexEmail } = require('../utils/regex.js');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => regexUrl.test(url),
        message: 'Введен некорректный адрес ссылки',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => regexEmail.test(email),
        message: 'Введен некорректный адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
