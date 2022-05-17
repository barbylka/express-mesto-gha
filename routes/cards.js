const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');
const { urlRegEx } = require('../utils/constants');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(urlRegEx).required()
  }),
}), postCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), deleteCard);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required()
  })
}), dislikeCard);

module.exports = {
  cardRouter
};
