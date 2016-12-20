//eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
const validations = require('../validations/listings');
const { camelizeKeys, decamelizeKeys } = require('humps');
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
router.post('/listings', authorize, ev(validations.post), (req, res, next) => {
  const {location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes} = req.body;


  const { userId } = req.token;

  knex('listings')
    .insert(decamelizeKeys({location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes}), '*')
    .returning('id')
    .then((id) => {
      knex('users_listings')
        .insert(decamelizeKeys({userId, listingsId: id[0]}), '*')
        .then((listingsRow) => {
            res.send(decamelizeKeys(listingsRow));
        });
    })
    .catch((err) => {
      next(err);
    });
});

//Get individual meal
router.get('/listings/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { id } = req.params;

  knex('listings')
  .where('id', id)
  .first()
  .then((listing) => {
    if (listing === [] || !listing) {
      throw boom.create(400, `No listings exist for user`);
    }

    res.send(meal);
  })
  .catch((err) => {
    next(err);
  });
});

//Get all listings
router.get('/listings', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('listings')
    .then((listings) => {
      if (listings === [] || !listings) {
        throw boom.create(400, `No listings found`);
      }

      res.send(listings);
    })
    .catch((err) => {
      next(err);
    });
});

// Patch a meal
router.patch('/listings/:id', authorize, ev(validations.post), (req, res, next) => {
  const { location, neighborhood, streetAddress, crossStreets, cost, costPer, bedrooms, bathroooms, housingType, rent, own, roommates, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes } = req.body;
  const { id } = req.params;
  const { userId } = req.token;

  knex('listings')
  .where('id', id)
  .first()
  .then((row) => {
    console.log(row);

    if (!row) {
      throw boom.create(400, `No meal found at listings.id ${id}`);
    }

    knex('users_listings')
      .where('user_id', userId)
      .where('meal_id', id)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `Meal at meal.id ${id} does not belong to user.id ${userId}`);
        }
      })
      .catch((err) => {
        next(err);
      });

    const updateRow = {};

    if (name) {
      updateRow.name = name;
    }

    if (meal) {
      updateRow.meal = meal;
    }

    return knex('listings')
      .where('id', id)
      .update(decamelizeKeys(updateRow), '*');
    })
    .then((row) =>  {
      res.send(camelizeKeys(row));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/listings/:id', authorize, (req, res, next) => {
  const mealId = req.params.id;
  const { userId } = req.token;
  const deleted = {};

  knex('listings')
    .where('id', mealId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No meal at meal.id ${mealId}`);
      }

      deleted.fromMeals = camelizeKeys(row);

      knex('users_listings')
      .where('meal_id', mealId)
      .then((row) => {
        if (Number(row.user_id) !== userId && row.user_id) {
          throw boom.create(400, `Meal_id ${mealId} does not belong to current user user.id ${userId}`);
        }
      })
      .catch((err) => {
        next(err);
      });
    })
    .then(() => {
      knex('users_listings')
      .where('meal_id', mealId)
      .where('user_id', userId)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `meal.id ${mealId} exists in listings, but there's no entry for it in users_listings. This shouldn't be possible.`);
        }

        deleted.fromMealsUsers = camelizeKeys(row);

        return knex('listings')
          .where('id', mealId)
          .del();
      })
      .then(() => {
        res.send(deleted);
      })
      .catch((err) => {
        next(err);
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;