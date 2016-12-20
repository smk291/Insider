/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('listings').del()
    .then(() => {
      return knex('listings').insert([{
        // Inserts seed entries
      })
      .then(() => {
        return knex.raw(
          "SELECT setval('listings_id_seq', (SELECT MAX(id) FROM listings));"
        );
      });
  };
