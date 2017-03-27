const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const titleize = require('underscore.string/titleize');
const humanize = require('underscore.string/humanize');
// const ev = require('express-validation');
// const validations = require('../validations/token');

// eslint-disable-next-line babel/new-cap
const router = express.Router();

// eslint-disable-next-line func-names
const formatListing = function (listing) {
  const fL = listing;

  fL.title = titleize(fL.title);
  fL.descr = humanize(fL.descr);

  if (fL.neighborhood) {
    fL.neighborhood.toLowerCase();
    fL.neighborhood = titleize(fL.neighborhood);
  }

  return fL;
};

// eslint-disable-next-line func-names
const authorize = function (req, res, next) {
  // eslint-disable-next-line consistent-return
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // eslint-disable-next-line no-param-reassign
      res.verify = false;

      return next(boom.create(401, 'Unauthorized'));
    }

    // eslint-disable-next-line no-param-reassign
    res.verify = true;
    // eslint-disable-next-line no-param-reassign
    req.token = decoded;

    next();
  });
};

// Unused
router.get('/listings_individual/:id', authorize, (req, res, next) => {
  const { id } = req.params;

  knex('listings')
    .where('id', id)
    .first()
    .then(listing => {
      if (listing === [] || !listing) {
        throw boom.create(400, 'No listings exist for user');
      }

      res.send(listing);
    })
    .catch(err => next(err));
});

router.get('/listings', (req, res, next) => {
  knex('listings').orderBy('urlnum', 'desc')
    .then(listings => {
      if (listings === [] || !listings) {
        throw boom.create(400, 'No listings found');
      }

      let formattedListings = [];
      formattedListings = listings.map(listing => formatListing(listing));

      res.send(formattedListings);
    })
    .catch(err => next(err));
});

router.get('/listings_sans_void', (req, res, next) => {
  knex('listings')
    .whereNull('void')
    .orderBy('id', 'asc')
    .then(activeListings => {
      res.status(200).send(activeListings.map(listing => {
        return {url: listing.url, urlnum: listing.urlnum};
      }));
    })
    .catch(err => next(err));
});

router.patch('/listings/:id', authorize, /* ev(validations.post),*/ (req, res, next) => {
  const patchContents = {};
  const { id } = req.params;

  // eslint-disable-next-line array-callback-return
  Object.keys(req.body).map(key => {
    if (req.body[key] && key !== 'Content-Type') {
      patchContents[key] = req.body[key];
    }
  });

  knex('listings')
    .where('id', id)
    .first()
    .then(row => {
      if (!row) {
        throw boom.create(400, `No listing found at listings.id ${id}`);
      }

      return knex('listings')
        .where('id', id)
        .update(decamelizeKeys(patchContents), '*')
        .then(patchedRow => {
          res.send(camelizeKeys(patchedRow));
        })
        .catch(err => { throw boom.create(400, err); });
    })
    .then(row => res.send(camelizeKeys(row)))
    .catch(err => next(err));
});

module.exports = router;
