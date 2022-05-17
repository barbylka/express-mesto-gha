const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser
} = require('../controllers/users');
const { urlRegEx } = require('../utils/constants');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required()
  })
}), getUserById);
userRouter.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required()
  }),
}), updateUser);
userRouter.patch('/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegEx).required()
  }),
}), updateAvatar);

module.exports = {
  userRouter
};
