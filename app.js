const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, postUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegEx)
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegEx)
  }),
}), postUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.status(404).send({
    message: 'Страница не найдена'
  });
});

app.use(errors());

app.use((err, req, res, next) => {
  const e = err;
  if (!e.statusCode) {
    e.statusCode = 500;
    e.message = 'На сервере произошла ошибка';
  }
  res.status(e.statusCode).send({ message: e.message });
});

app.listen(PORT);
