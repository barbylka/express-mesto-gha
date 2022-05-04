const User = require('../models/user');

const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;

const proccessError = (res, ERROR_CODE, message) => {
  res.status(ERROR_CODE).send({
    message
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный id');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true
      }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
    } else if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный  id пользователя');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true
      }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      proccessError(res, NOT_FOUND_ERROR, 'Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Переданы некорректные данные');
    } else if (err.name === 'CastError') {
      proccessError(res, BAD_REQUEST_ERROR, 'Передан некорректный  id пользователя');
    } else {
      proccessError(res, DEFAULT_ERROR, 'Ошибка в работе сервера');
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar
};
