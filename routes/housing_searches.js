//eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/housing_searches');
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


//Post housing_search
router.post('/housing_searches', authorize, /*ev(validations.post),*/ (req, res, next) => {
  const {
    location, costMin, costMax, bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, housingType, rent, own, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, laundryCost, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  } = req.body;


  const { userId } = req.token;

  knex('housing_searches')
    .insert(decamelizeKeys({
      location, costMin, costMax, bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, housingType, rent, own, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, laundryCost, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
    }), '*')
    .returning('id')
    .then((id) => {
      knex('users_housing_searches')
        .insert(decamelizeKeys({userId, housingSearchesId: id[0]}), '*')
        .then((housingSearchesRow) => {
            res.send(decamelizeKeys(housingSearchesRow));
        });
    })
    .catch((err) => {
      next(err);
    });
});

//Get individual housing_search
router.get('/housing_searches/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { id } = req.params;

  knex('housing_searches')
  .where('id', id)
  .first()
  .then((housingSearch) => {
    if (housingSearch === [] || !housingSearch) {
      throw boom.create(400, `No housing_searches exist for user`);
    }

    res.send(housingSearch);
  })
  .catch((err) => {
    next(err);
  });
});

//Get all housing_searches
router.get('/housing_searches', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('housing_searches')
    .then((housingSearches) => {
      if (housingSearches === [] || !housingSearches) {
        throw boom.create(400, `No housing_searches found`);
      }

      res.send(housingSearches);
    })
    .catch((err) => {
      next(err);
    });
});

// Patch a housing_search
router.patch('/housing_searches/:id', authorize, /*ev(validations.post),*/ (req, res, next) => {
  const {
    location, costMin, costMax, bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, housingType, rent, own, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, laundryCost, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
} = req.body;
  const { id } = req.params;
  const { userId } = req.token;
  const postContents = {
    location, costMin, costMax, bedroomsMin, bedroomsMax, bathroomsMin, bathroomsMax, housingType, rent, own, roommatesMin, roommatesMax, allowPets, allowSmoking, laundry, laundryCost, parking, parkingCost, allUtilitiesInc, heatInc, wifiInc, waterInc, electricityInc, garbageInc, descr, notes
  };

  knex('housing_searches')
  .where('id', id)
  .first()
  .then((row) => {
    if (!row) {
      throw boom.create(400, `No housing_search found at housing_searches.id ${id}`);
    }

    knex('users_housing_searches')
    .where('user_id', userId)
    .where('housing_searches_id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `Housing_search at id ${id} does not belong to user.id ${userId}`);
      }
    })
    .catch((err) => {
      next(err);
    });

    const updateRow = {};

    for (let key in postContents) {
      if (key) {
        updateRow[key] = postContents[key];
      }
    }

    return knex('housing_searches')
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

router.delete('/housing_searches/:id', authorize, (req, res, next) => {
  const housingSearchId = req.params.id;
  const { userId } = req.token;
  const deleted = {};

  knex('housing_searches')
    .where('id', housingSearchId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No housing_search at housing_search.id ${housingSearchId}`);
      }

      deleted.fromMeals = camelizeKeys(row);

      knex('users_housing_searches')
      .where('housing_search_id', housingSearchId)
      .then((row) => {
        if (Number(row.user_id) !== userId && row.user_id) {
          throw boom.create(400, `Meal_id ${housingSearchId} does not belong to current user user.id ${userId}`);
        }
      })
      .catch((err) => {
        next(err);
      });
    })
    .then(() => {
      knex('users_housing_searches')
      .where('housing_search_id', housingSearchId)
      .where('user_id', userId)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `housing_search.id ${housingSearchId} exists in housing_searches, but there's no entry for it in users_housing_searches. This shouldn't be possible.`);
        }

        deleted.fromMealsUsers = camelizeKeys(row);
        return knex('housing_searches')
          .where('id', housingSearchId)
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
