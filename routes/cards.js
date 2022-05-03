const express = require('express');
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', express.json(), postCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = {
  cardRouter,
};
