//eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
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

router.get('/users_housing_searches', authorize, (req, res, next) => {
  if (!req.verify) {
    return boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;

  knex('users_housing_searches')
    .where('id', userId)
    .then((searches) => {
      res.send(camelizeKeys(searches));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users_housing_searches_complete', authorize, (req, res, next) => {
  if (!req.verify) {
    return boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;

  knex('users_housing_searches')
    .where('users_housing_searches.id', userId)
    .join('housing_searches_listings_users', 'housing_searches_listings_users.user_id', userId)
    .innerJoin('listings', 'listings.id', 'housing_searches_listings_users.listings_id')
    .then((searches) => {
      res.send(camelizeKeys(searches));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
