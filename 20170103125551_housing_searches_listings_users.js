'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('housing_searches_listings_users', (table) => {
    table.increments();
    table.integer('housing_searches_id')
      .notNullable()
      .references('id')
      .inTable('housing_searches')
      .onDelete('CASCADE')
      .index();
    table.integer('listings_id')
      .notNullable()
      .references('id')
      .inTable('listings')
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('housing_searches_listings_users');
};
