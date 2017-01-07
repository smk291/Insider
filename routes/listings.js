//eslint-disable-next-line new-cap
'use strict';

const boom                           = require('boom');
const bcrypt                         = require('bcrypt-as-promised');
const express                        = require('express');
const router                         = express.Router();
const jwt                            = require('jsonwebtoken');
const knex                           = require('../knex');
const ev                             = require('express-validation');
const bluebird                       = require('bluebird');
// const validations = require('../validations/token');
const {camelizeKeys, decamelizeKeys} = require('humps');
const request                        = require('request');
const cheerio                        = require('cheerio');
const fs                             = require('fs');
const decycle                        = require('json-decycle').decycle;
const retrocycle                     = require('json-decycle').retrocycle;
const timeout                        = require('connect-timeout');

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

var CerealScraper   = require('cerealscraper'),
  TextSelector      = CerealScraper.Blueprint.TextSelector,
  ConstantSelector  = CerealScraper.Blueprint.ConstantSelector,
  TransformSelector = CerealScraper.Blueprint.TransformSelector,
  Promise           = require('bluebird');

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

      res.send(listings);
    }).catch((err) => {
      next(err);
    });
});

router.patch('/listings/:id', authorize,/*ev(validations.post),*/ (req, res, next) => {

  let patchContents = {}

  Obj.keys(req.body).map((key) => {
    if (req.body[key]){
      patchContents[key] = req.body[key];
    }
  });

  const { id } = req.params;

  const { userId } = req.token;

  knex('listings').where('id', id).first().then((row) => {
    if (!row) {
      throw boom.create(400, `No listing found at listings.id ${id}`);
    }

    // knex('housing_searches_listings_users').where('user_id', userId).where('listings_id', id).first().then((row) => {
    //   if (!row) {
    //     throw boom.create(400, `Listing at id ${id} does not belong to user.id ${userId}`);
    //   }
    // }).catch((err) => {
    //   next(err);
    // });

    return knex('listings').where('id', id).update(decamelizeKeys(updateRow), '*');
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
