const express = require('express');
const knex = require('../knex');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const titleize = require('underscore.string/titleize');
const humanize = require('underscore.string/humanize');

// eslint-disable-next-line babel/new-cap
const router = express.Router();

function formatListing(listing) {
  const fL = listing;

  fL.title = titleize(fL.title);
  fL.descr = humanize(fL.descr);

  if (fL.neighborhood) {
    fL.neighborhood = titleize(fL.neighborhood.toLowerCase());
  }

  return fL;
}

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

router.post('/users_listings', authorize, (req, res, next) => {
  if (!req.verify) {
    throw boom.create(401, 'Unauthorized. Please log in.');
  }

  const { userId } = req.token;
  const { listingsId } = req.body;

  knex('users')
    .where('id', userId)
    .first()
    .then(user => {
      if (!user || user.length === 0) {
        throw boom.create(400, 'Attempting to access nonexistent user account or someone else\'s account');
      }

      knex('listings_sub')
        .where('id', listingsId)
        .first()
        .then(listing => {
          if (!listing || listing.length === 0) {
            throw boom.create(400, 'Attempting to access nonexistent listing');
          }

          knex('users_listings')
            .where('user_id', userId)
            .where('listings_sub_id', listingsId)
            .first()
            .then(userListing => {
              if (userListing) {
                throw boom.create(400, 'Already favorited.');
              }

              knex('users_listings')
                .insert(decamelizeKeys({ userId, listingsId }), '*')
                .then(newUserListing => res.send(camelizeKeys(newUserListing)))
                .catch(err => next(err));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get('/users_listings', authorize, (req, res, next) => {
  if (!req.verify) {
    throw boom.create(401, 'Unauthorized');
  }

  knex('users_listings')
    .select('users_listings.id', 'listings_sub_id')
    .innerJoin('listings_sub', 'listings_sub.id', 'users_listings.listings_sub_id')
    .select(
      'bath',
      'bedrooms',
      'cat',
      'descr',
      'dog',
      'furnished',
      'housing',
      'lat',
      'laundry',
      'lon',
      'neighborhood',
      'parking',
      'photos',
      'post_date',
      'price',
      'private_room',
      'smoking',
      'sqft',
      'street_address',
      'sub_or_apt',
      'title',
      'url',
      'urlnum',
      'void',
      'wheelchair')
    .then(favs => {
      if (!favs) {
        throw boom.create(400, 'No favorites');
      }

      let formattedFavs = [];
      formattedFavs = favs.map(listing => formatListing(listing));

      res.send(camelizeKeys(formattedFavs));
    })
    .catch(err => next(err));
});

router.delete('/users_listings/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { id } = req.params;

  knex('users_listings')
    .where('id', id)
    .first()
    .then(row => {
      if (!row) {
        throw boom.create(400, `No row at id ${id}`);
      }

      if (Number(row.user_id) !== userId && Number(row.user_id)) {
        throw boom.create(400, `Row at id ${id} does not belong to user id ${userId}`);
      }

      knex('users_listings')
        .where('id', id)
        .del()
        .returning('*')
        .first()
        .then(deletedRow => {
          if (!deletedRow) {
            throw boom.create(400, 'This shouldn\'t be possible...');
          }

          res.send(camelizeKeys(deletedRow));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
