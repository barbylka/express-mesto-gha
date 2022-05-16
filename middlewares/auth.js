const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/ForbiddenError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new ForbiddenError('Необходима авторизация'));
  } else {
    const token = authorization;
    let payload;
    try {
      payload = jwt.verify(token, 'super-strong-secret');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};
