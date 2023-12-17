const User = require('../models/user.js')
const ValidationError = require('../utils/ValidationError')
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
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
      case 'ValidationError':
       return res.status(error.statusCode).send(error.message);

       default :
         return res.status(500).send({message: "Ошибка на стороне сервера", error: error.message});
     }
  }
};


const upUser = async (req, res) => {
  try  {
    const {name, about} = req.body;
    const upUserProfile = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );
    return res.status(201).send(upUserProfile);
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

const upUserAvatar = async (req, res) => {
  try  {
    const {avatar} = req.body;
    const upUserAvatr = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    return res.status(201).send(upUserAvatr);
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
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  upUser,
  upUserAvatar
}
