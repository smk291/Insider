'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('users_housing_searches', (table) => {
    table.increments();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.integer('housing_searches_id')
      .notNullable()
      .references('id')
      .inTable('housing_searches')
      .onDelete('CASCADE')
      .index();
    table.timestamp('searched_at').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users_housing_searches');
};
