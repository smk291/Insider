//eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/listings');
const {camelizeKeys, decamelizeKeys} = require('humps');
const jwt = require('jsonwebtoken');

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

//Post meal
router.post('/listings', authorize,
/*ev(validations.post),*/
(req, res, next) => {
  const {
    housingSearchesId, location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  } = req.body;

  const {userId} = req.token;

  knex('listings').insert(decamelizeKeys({
    location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  }), '*').returning('id').then((id) => {
    knex('housing_searches_listings_users').insert(decamelizeKeys({userId, listingsId: id[0], housingSearchesId}), '*').then((housingSearchesListingsUsersRow) => {
      res.send(decamelizeKeys(housingSearchesListingsUsersRow));
    });
  }).catch((err) => {
    next(err);
  });

  knex
});

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

//Get all listings
router.get('/listings', authorize, (req, res, next) => {
  const {userId} = req.token;

  knex('listings').then((listings) => {
    if (listings === [] || !listings) {
      throw boom.create(400, `No listings found`);
    }

    res.send(listings);
  }).catch((err) => {
    next(err);
  });
});

// Patch a listing
router.patch('/listings/:id', authorize,
/*ev(validations.post),*/
(req, res, next) => {
  const {
    housingSearchesId, location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  } = req.body;
  const {id} = req.params;
  const {userId} = req.token;
  const patchContents = {
    location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  };

  knex('listings').where('id', id).first().then((row) => {
    console.log(row);

    if (!row) {
      throw boom.create(400, `No listing found at listings.id ${id}`);
    }

    knex('housing_searches_listings_users').where('user_id', userId).where('listings_id', id).first().then((row) => {
      if (!row) {
        throw boom.create(400, `Listing at id ${id} does not belong to user.id ${userId}`);
      }
    }).catch((err) => {
      next(err);
    });

    const updateRow = {};

    console.log(req.body);

    for (let key in patchContents) {
      if (key) {
        updateRow[key] = patchContents[key];
      }
    }

    return knex('listings').where('id', id).update(decamelizeKeys(updateRow), '*');
  }).then((row) => {
    res.send(camelizeKeys(row));
  }).catch((err) => {
    next(err);
  });
});

router.delete('/listings/:id', authorize, (req, res, next) => {
  const listingsId = req.params.id;
  const {userId} = req.token;
  const deleted = {};

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
