const express                          = require('express');
const router                           = express.Router();
const knex                             = require('../knex');
const bcrypt                           = require('bcrypt-as-promised');
const boom                             = require('boom');
const jwt                              = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const titleize                         = require('underscore.string/titleize');
const humanize                         = require('underscore.string/humanize');

function formatListing(listing) {
  listing.title = titleize(listing.title);
  listing.descr = humanize(listing.descr);

  if (listing.price && listing.price[0] !== '$') {
    listing.price = '$' + listing.price;
  }

  if (listing.neighborhood[0] === '(' && listing.neighborhood[listing.neighborhood.length - 1] === ')') {
    listing.neighborhood = listing.neighborhood.slice(1);
    listing.neighborhood = listing.neighborhood.slice(0, -1);
  }

  listing.neighborhood = listing.neighborhood.toLowerCase();
  listing.neighborhood = titleize(listing.neighborhood);

  return listing;
}

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

router.post('/users_listings', authorize, (req, res, next) => {
  if (!req.verify){
    throw boom.create(401,'Unauthorized. Please log in.')
  }

  const { userId } = req.token;
  const { listingsId } = req.body;

  knex('users')
  .where('id', userId)
  .first()
  .then((row) => {
    if (!row || row.length === 0){
      throw boom.create(400, 'Attempting to access nonexistent user account or someone else\'s account')
    }

    knex('listings')
    .where('id', listingsId)
    .first()
    .then((row) => {
      if (!row || row.length === 0){
        throw boom.create(400, 'Attempting to access nonexistent listing')
      }

      knex('users_listings')
      .where('user_id', userId)
      .where('listings_id', listingsId)
      .first()
      .then((row) => {
        if (row){
          throw boom.create(400, `Already favorited.`)
        }

        knex('users_listings')
        .insert(decamelizeKeys({userId, listingsId}), '*')
        .then((row) => {
          res.send(camelizeKeys(row))
        }).catch((err) => {
          next(err);
        })
      }).catch((err) => {
        next(err);
      });
    }).catch((err) => {
      next(err);
    });

  }).catch((err) => {
    next(err);
  });
})

router.get('/users_listings', authorize, (req, res, next) => {
  if (!req.verify) {
    throw boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;
  let favListings = [];

  knex('users_listings')
    .select('users_listings.id', 'listings_id')
    .innerJoin('listings', 'listings.id', 'users_listings.listings_id')
    .select(
      'bath',
      'bedrooms',
      'cat',
      'checked',
      'descr',
      'dog',
      'furnished',
      'housing',
      'last_checked',
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
      'state',
      'street_address',
      'sub_or_apt',
      'title',
      'url',
      'urlnum',
      'void',
      'wheelchair',
      'zip')
    .select()

    .then((favs) => {
      if (!favs) {
        throw boom.create(400, 'No favorites');
      }

      favs = favs.map((listing) => formatListing(listing));

      res.send(camelizeKeys(favs));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/users_listings/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { id } = req.params;
  let deleted = {};

  knex('users_listings')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No row at id ${id}`);
      }

      if (Number(row.user_id) !== userId && Number(row.user_id)) {
        throw boom.create(400, `Row at id ${id} does not belong to user id ${userId}`);
      }

      deleted = camelizeKeys(row);

      knex('users_listings')
        .where('id', id)
        .del()
        .returning('*')
        .first()
        .then((deletedRow) => {
          if (!deletedRow) {
            throw boom.create(400, `This shouldn't be possible...`);
          }

          res.send(deletedRow);
        }).catch((err) => {
          next(err);
      });
    }).catch((err) => {
      next(err);
    });
});

module.exports = router;
