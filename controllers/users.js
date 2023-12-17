const User = require('../models/user.js')
const ValidationError = require('../utils/ValidationError')
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).send({message: "Ошибка на стороне сервера", error: error.message});
  }
};

const getUserById = async (req, res) => {
try {
  const {userId} = req.params;
  const user = await User.findById(userId).orFail(() => new ValidationError('Пользователь по заданному ID не найден'));
  return res.status(200).send(user);
} catch (error) {
   switch (error.name) {
    case 'CastError':
     return res.status(400).send({message: "Передан не валидный ID"});

    case 'ValidationError':
      return res.status(error.statusCode).send(error.message);

     default :
       return res.status(500).send({message: "Ошибка на стороне сервера", error: error.message});
   }
}



};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
       return res.status(400).send({message: "Передан не валидный ID"});

       default :
         return res.status(500).send({message: "Ошибка на стороне сервера", error: error.message});
     }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser
}
