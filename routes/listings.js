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

const monthsShort = {
  0: "Jan.",
  1: "Feb.",
  2: "Mar.",
  3: "Apr.",
  4: "May",
  5: "June",
  6: "July",
  7: "Aug.",
  8: "Sept.",
  9: "Oct.",
  10: "Nov.",
  11: "Dec."
}

// eslint-disable-next-line func-names
const formatListing = function (listing) {
  const fL = listing;

  if (fL.title.indexOf(' ') === -1) {
    fL.title = 'Censored';
  } else{
    fL.title = titleize(fL.title);
  }
  fL.descr = humanize(fL.descr);

  if (fL.neighborhood) {
    fL.neighborhood.toLowerCase();
    fL.neighborhood = titleize(fL.neighborhood);
  }

  let date = new Date(fL.post_date);
  fL.post_date = `${monthsShort[date.getMonth()]} ${date.getDate()}`;
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
router.get('/listings_individual/:id/:subOrApt', authorize, (req, res, next) => {
  const { id, subOrApt } = req.params;

  knex(`listings_${subOrApt}`)
    .where('id', id)
    .first()
    .then(listing => {
      if (listing === [] || !listing) {
        throw boom.create(400, 'No listings exist for user');
      }

      res.send(camelizeKeys(formatListing(listing)));
    })
    .catch(err => next(err));
});

router.get('/listings_all/:subOrApt', (req, res, next) => {
  const { subOrApt } = req.params;

  knex(`listings_${subOrApt}`)
    .orderBy('urlnum', 'desc')
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

router.get('/listings_active/:subOrApt', (req, res, next) => {
  const { subOrApt } = req.params;

  knex(`listings_${subOrApt}`)
    .whereNull('void')
    .orderBy('urlnum', 'desc')
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

router.patch('/listings/:id/:subOrApt', authorize, /* ev(validations.post),*/ (req, res, next) => {
  const patchContents = {};
  const { id, subOrApt } = req.params;

  // eslint-disable-next-line array-callback-return
  Object.keys(req.body).map(key => {
    if (req.body[key] && key !== 'Content-Type') {
      patchContents[key] = req.body[key];
    }
  });

  knex(`listings_${subOrApt}`)
    .where('id', id)
    .first()
    .then(row => {
      if (!row) {
        throw boom.create(400, `No listing found at listings.id ${id}`);
      }

      return knex(`listings_${subOrApt}`)
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
