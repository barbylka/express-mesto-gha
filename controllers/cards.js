const Card = require('../models/card');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;

const proccessError = (res, ERROR_CODE, message) => {
  res.status(ERROR_CODE).send({
    message
  });
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
  }
};

const postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const _id = req.user._id;
    const newCard = await Card.create({ name, link, owner: _id });
    res.status(201).send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card) {
      res.status(200).send({
        message: 'Пост удален',
      });
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный id поста');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .populate(['owner', 'likes']);
    if (card) {
      res.status(200).send(card);
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный id поста');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .populate(['owner', 'likes']);
    if (card) {
      res.status(200).send(card);
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный id поста');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard
};
