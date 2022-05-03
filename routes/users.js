const express = require('express');
const {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', express.json(), postUser);
userRouter.patch('/me', express.json(), updateUser);
userRouter.patch('/me/avatar', express.json(), updateAvatar);

module.exports = {
  userRouter,
};
