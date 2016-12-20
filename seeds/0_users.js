/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        // Inserts seed entries
      })
      .then(() => {
        return knex.raw(
          "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
        );
      });
  };
