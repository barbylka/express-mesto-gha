const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const DUPLICATE_MONGOOSE_ERROR = 11000;
const SALT_ROUNDS = 10;

const checkInputs = (req, res, next) => {
  const value = !req.body.email || !req.body.password;
  if (value) {
    next(new BadRequestError('Переданы некорректные данные'));
  }
  return (value);
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
    } else {
      next(err);
    }
  }
};

const postUser = async (req, res, next) => {
  if (!checkInputs(req, res)) {
    try {
      if (validator.isEmail(req.body.email)) {
        const {
          name, about, avatar, email, password
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        let user = await User.create({
          name, about, avatar, email, password: hashedPassword
        });
        user = user.toObject();
        delete user.password;
        res.status(201).send(user);
      } else {
        next(new BadRequestError('Передан некорректный email'));
      }
    } catch (err) {
      if (err.code === DUPLICATE_MONGOOSE_ERROR) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    }
  }
};

const updateUser = async (req, res, next) => {
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
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный  id пользователя'));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
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
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный  id пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  if (!checkInputs(req, res)) {
    try {
      const { email, password } = req.body;
      const user = await User.findUserByCredentials(email, password);
      if (user) {
        const token = await jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true
          })
          .status(200).send({ token });
      } else {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
    } catch (err) {
      if (err.message === 'Unauthorized error') {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser
};
