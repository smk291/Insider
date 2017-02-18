//eslint-disable-next-line new-cap
'use strict';

const boom                           = require('boom');
const bcrypt                         = require('bcrypt-as-promised');
const express                        = require('express');
const router                         = express.Router();
const jwt                            = require('jsonwebtoken');
const knex                           = require('../knex');
// const ev                             = require('express-validation');
// const validations = require('../validations/token');
const {camelizeKeys, decamelizeKeys} = require('humps');
const request                        = require('request');
const titleize                       = require('underscore.string/titleize');
const humanize                       = require('underscore.string/humanize');

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

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.verify = false;

      return next(boom.create(401, 'Unauthorized'));
    }

    res.verify = true;
    req.token = decoded;

    next();
  });
};

//Get individual listing
router.get('/listings/:id', authorize, (req, res, next) => {
  const {userId} = req.token;
  const {id} = req.params;

  knex('listings').where('id', id).first().then((listing) => {
    if (listing === [] || !listing) {
      throw boom.create(400, `No listings exist for user`);
    }

    res.send(listing);
  }).catch((err) => {
    next(err);
  });
});

router.get('/listings', (req, res, next) => {
  knex('listings')
    .orderBy('urlnum', 'desc')
    .then((listings) => {
      if (listings === [] || !listings) {
        throw boom.create(400, `No listings found`);
      }

      listings = listings.map((listing) => formatListing(listing))

      res.send(listings);
    }).catch((err) => {
      next(err);
    });
});

router.get('/listings_check_for_404', (req, res, next) => {
  knex('listings')
    .whereNull('void')
    .orderBy('id', 'asc')
    .then((rows) => {
      let listings = rows;

      listings = listings.filter((el) => {
        return el.void === null;
      })

      listings = listings.map((el) => {
        return el.urlnum;
      });

      res.send(listings);
      res.end();
    }).catch((err) => {
      next(err);
    });
});

router.patch('/listings/:id', authorize, /*ev(validations.post),*/ (req, res, next) => {
  let patchContents = {};
  const { id } = req.params;
  const { userId } = req.token;

  Object.keys(req.body).map((key) => {
    if (req.body[key] && key !== 'Content-Type'){
      patchContents[key] = req.body[key];
    }
  });

  knex('listings')
  .where('id', id)
  .first()
  .then((row) => {
    if (!row) {
      throw boom.create(400, `No listing found at listings.id ${id}`);
    }

    return knex('listings')
    .where('id', id)
    .update(decamelizeKeys(patchContents), '*')
    .then((row) => {
      res.send(row)
    }).catch((err) => {
      throw boom.create(400, err);
    })
  }).then((row)  => {
    res.send(camelizeKeys(row));
  }).catch((err) => {
    next(err);
  });
});

router.delete('/listings/:id', authorize, (req, res, next) => {
  const listingsId = req.params.id;
  const { userId } = req.token;
  const deleted    = {};

  knex('listings').where('id', listingsId).first().then((row) => {
    if (!row) {
      throw boom.create(400, `No listing at listing.id ${listingsId}`);
    }

    deleted.fromListings = camelizeKeys(row);

    knex('housing_searches_listings_users').where('listings_id', listingsId).then((row) => {
      if (Number(row.user_id) !== userId && row.user_id) {
        throw boom.create(400, `listings_id ${listingsId} does not belong to current user user.id ${userId}`);
      }
    }).catch((err) => {
      next(err);
    });
  }).then(() => {
    knex('housing_searches_listings_users').where('listings_id', listingsId)
      .where('user_id', userId)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `listings.id ${listingsId} exists in listings, but there's no entry for it in users_listings. This shouldn't be possible.`);
        }

        deleted.fromListingsUsers = camelizeKeys(row);

        return knex('listings').where('id', listingsId).del();
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
