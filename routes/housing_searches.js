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
    location,
    cost_min,
    cost_max,
    bedrooms_min,
    bedrooms_max,
    bathroooms_min,
    bathroooms_max,
    housing_type,
    rent,
    own,
    roommates_min,
    roommates_max,
    allow_pets,
    allow_smoking,
    laundry,
    laundry_cost,
    parking,
    parking_cost,
    all_utilities_inc,
    heat_inc,
    wifi_inc,
    water_inc,
    electricity_inc,
    garbage_inc,
    descr,
    notes
  } = req.body;


  const { userId } = req.token;

  knex('housing_searches')
    .insert(decamelizeKeys({
      location,
      cost_min,
      cost_max,
      bedrooms_min,
      bedrooms_max,
      bathroooms_min,
      bathroooms_max,
      housing_type,
      rent,
      own,
      roommates_min,
      roommates_max,
      allow_pets,
      allow_smoking,
      laundry,
      laundry_cost,
      parking,
      parking_cost,
      all_utilities_inc,
      heat_inc,
      wifi_inc,
      water_inc,
      electricity_inc,
      garbage_inc,
      descr,
      notes
    }), '*')
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

//Get individual housing_search
router.get('/housing_searches/:id', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { id } = req.params;

  knex('housing_searches')
  .where('id', id)
  .first()
  .then((listing) => {
    if (listing === [] || !listing) {
      throw boom.create(400, `No housing_searches exist for user`);
    }

    res.send(housing_search);
  })
  .catch((err) => {
    next(err);
  });
});

//Get all housing_searches
router.get('/housing_searches', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('housing_searches')
    .then((housing_searches) => {
      if (housing_searches === [] || !housing_searches) {
        throw boom.create(400, `No housing_searches found`);
      }

      res.send(housing_searches);
    })
    .catch((err) => {
      next(err);
    });
});

// Patch a housing_search
router.patch('/housing_searches/:id', authorize, /*ev(validations.post),*/ (req, res, next) => {
  const {
      location,
      cost_min,
      cost_max,
      bedrooms_min,
      bedrooms_max,
      bathroooms_min,
      bathroooms_max,
      housing_type,
      rent,
      own,
      roommates_min,
      roommates_max,
      allow_pets,
      allow_smoking,
      laundry,
      laundry_cost,
      parking,
      parking_cost,
      all_utilities_inc,
      heat_inc,
      wifi_inc,
      water_inc,
      electricity_inc,
      garbage_inc,
      descr,
      notes
} = req.body;
  const { id } = req.params;
  const { userId } = req.token;
  const postContents = {
    location,
    cost_min,
    cost_max,
    bedrooms_min,
    bedrooms_max,
    bathroooms_min,
    bathroooms_max,
    housing_type,
    rent,
    own,
    roommates_min,
    roommates_max,
    allow_pets,
    allow_smoking,
    laundry,
    laundry_cost,
    parking,
    parking_cost,
    all_utilities_inc,
    heat_inc,
    wifi_inc,
    water_inc,
    electricity_inc,
    garbage_inc,
    descr,
    notes
  };

  knex('housing_searches')
  .where('id', id)
  .first()
  .then((row) => {
    console.log(row);

    if (!row) {
      throw boom.create(400, `No housing_search found at housing_searches.id ${id}`);
    }

    knex('users_listings')
      .where('user_id', userId)
      .where('listings_id', id)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `Listing at id ${id} does not belong to user.id ${userId}`);
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
  const housing_searchId = req.params.id;
  const { userId } = req.token;
  const deleted = {};

  knex('housing_searches')
    .where('id', housing_searchId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, `No housing_search at housing_search.id ${housing_searchId}`);
      }

      deleted.fromMeals = camelizeKeys(row);

      knex('users_listings')
      .where('housing_search_id', housing_searchId)
      .then((row) => {
        if (Number(row.user_id) !== userId && row.user_id) {
          throw boom.create(400, `Meal_id ${housing_searchId} does not belong to current user user.id ${userId}`);
        }
      })
      .catch((err) => {
        next(err);
      });
    })
    .then(() => {
      knex('users_listings')
      .where('housing_search_id', housing_searchId)
      .where('user_id', userId)
      .first()
      .then((row) => {
        if (!row) {
          throw boom.create(400, `housing_search.id ${housing_searchId} exists in housing_searches, but there's no entry for it in users_listings. This shouldn't be possible.`);
        }

        deleted.fromMealsUsers = camelizeKeys(row);
        return knex('housing_searches')
          .where('id', housing_searchId)
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
