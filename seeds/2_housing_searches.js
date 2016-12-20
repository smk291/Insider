/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('housing_searches').del()
    .then(() => {
      return knex('housing_searches').insert([{
        // Inserts seed entries
      })
      .then(() => {
        return knex.raw(
          "SELECT setval('housing_searches_id_seq', (SELECT MAX(id) FROM housing_searches));"
        );
      });
  };
