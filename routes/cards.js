const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');

const cardRouter = express.Router();

const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

cardRouter.get('/', getCards);
cardRouter.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(urlRegEx).required()
  }),
}), postCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24)
  })
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24)
  })
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24)
  })
}), dislikeCard);

module.exports = {
  cardRouter
};
