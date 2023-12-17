const Card = require('../models/card.js')
const ValidationError = require('../utils/ValidationError')

const getCards = async (req, res) => {
  try {

    const cards = await Card.find({});

    return res.send(cards);

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

const deleteCard = async (req, res) => {
try {

  const {cardId} = req.params;
  const card = await Card.findById(cardId).orFail(() => new ValidationError('Пользователь по заданному ID не найден'));
  return res.status(200).send(card);

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

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create(req.body);
    newCard.owner = req.user._id;
    return res.status(201).send(newCard);
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

const likeCard = async (req, res) => {
  try  {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    return res.status(201).send(like);
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

const disLikeCard = async (req, res) => {
  try  {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    return res.status(201).send(like);
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard
}