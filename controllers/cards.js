const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const postCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const _id = req.user._id;
    const newCard = await Card.create({ name, link, owner: _id });
    res.status(201).send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные карточки1'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card && card.owner.toString() === req.user._id) {
      await card.remove();
      res.status(200).send({
        message: 'Пост удален',
      });
    } else if (!card) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      throw new ForbiddenError('Нельзя удалять чужие посты');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id поста'));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
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
      throw new NotFoundError('Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id поста'));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
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
      throw new NotFoundError('Карточка не найдена');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id поста'));
    } else {
      next(err);
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
