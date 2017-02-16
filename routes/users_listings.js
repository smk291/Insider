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
  console.log('hi!');

  if (!req.verify) {
    throw boom.create(401, 'Unauthorized');
  }

  const { userId } = req.token;
  let favListings = [];

  knex('users_listings')
    .where('user_id', userId)
    .innerJoin('listings', 'listings.id', 'users_listings.listings_id')

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

router.delete('/users_listings/:id/:userId', authorize, (req, res, next) => {
  const { listingsId } = req.body;
  const { userId } = req.token;
  const deleted = {};

  knex('users_listings')
    .where('listings_id', listingsId)
    .where('user_id', userId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No entry for user ${userId} at ${housingSearchId}`);
      }

      deleted.fromUsersListings = camelizeKeys(row);

      knex('users_listings')
      .where('listings_id', listingsId)
      .then((row) => {
        if (Number(row.user_id) !== userId && Number(row.user_id)) {
          throw boom.create(400, `listings_id ${listingsId} does not belong to current user user.id ${userId}`);
        }
      })
      .catch((err) => {
        next(err);
      });
    })
    .then(() => {
      knex('users_listings')
      .where('listings_id', listingsId)
      .where('user_id', userId)
      .del()
      .returning('*')
      .then((rows) => {
        if (!rows) {
          throw boom.create(400, `listings.id ${listingsId} exists in listings, but there's no entry for it in users_housing_searches. This shouldn't be possible.`);
        }

        deleted.fromUserListings = camelizeKeys(rows);
      }).then(() => {
        res.send(deleted);
      }).catch((err) => {
        next(err);
      });
    }).catch((err) => {
      next(err);
    });
});

module.exports = router;
