const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
// const ev = require('express-validation');
// const validations = require('../validations/users');

// eslint-disable-next-line babel/new-cap
const router = express.Router();
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // eslint-disable-next-line no-param-reassign
      req.verify = false;
    } else {
      // eslint-disable-next-line no-param-reassign
      req.verify = true;
      // eslint-disable-next-line no-param-reassign
      req.token = decoded;
    }

    next();
  });
}

// eslint-disable-next-line consistent-return
router.get('/users', authorize, (req, res, next) => {
  if (!req.verify) {
    return boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;

  knex('users')
    .where('id', userId)
    .first()
    .then(user => res.send(camelizeKeys(user)))
    .catch(err => next(err));
});

router.post('/users', /* ev(validations.post),*/ (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  knex('users')
    .where('email', email)
    .first()
    .then(match => {
      if (match) {
        throw boom.create(400, 'Email already exists!');
      }

      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      const insertUser = { firstName, lastName, email, hashedPassword };

      return knex('users')
        .insert(decamelizeKeys(insertUser), '*')
        .then(row => {
          return row;
        })
        .catch(err => {
          throw boom.create(400, err);
        });
    })
    .then(row => {
      const user = camelizeKeys(row);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch(err => next(err));
});

module.exports = router;
