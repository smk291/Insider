//eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/users');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.verify = false;
    } else {
      req.verify = true;
      req.token = decoded;
    }

    next();
  });
}

router.get('/users', authorize, (req, res, next) => {
  if (!req.verify) {
    return boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;

  knex('users')
    .where('id', userId)
    .first()
    .then((user) => {
      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/users', /*ev(validations.post),*/ (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .first()
    .then((match) => {
      if (match) {
        throw boom.create(400, 'Email already exists!');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const insertUser = { firstName, lastName, email, hashedPassword };

      return knex.transaction((trx) => {
        knex('users')
        .transacting(trx)
        .insert(decamelizeKeys(insertUser), '*')
        .then(trx.commit)
        .catch(trx.rollback)
      });
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
