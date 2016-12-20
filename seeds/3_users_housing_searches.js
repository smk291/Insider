/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users_housing_searches').del()
    .then(() => {
      return knex('users_housing_searches').insert([{
        // Inserts seed entries
      })
      .then(() => {
        return knex.raw(
          "SELECT setval('users_housing_searches_id_seq', (SELECT MAX(id) FROM users_housing_searches));"
        );
      });
  };
