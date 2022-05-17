const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/routes');
const { login, postUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { urlRegEx } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');

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
    password: Joi.string().required()
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegEx)
  }),
}), postUser);

app.use(helmet());
app.use(auth);
app.use('/', router);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
