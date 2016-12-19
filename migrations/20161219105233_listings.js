'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('listings', (table) => {
    table.increments();
    table.string('location').notNullable().defaultTo('');
    table.string('neighborhood').notNullable().defaultTo('');
    table.string('street_address').defaultTo('');
    table.string('cross_streets').defaultTo('');
    table.integer('cost');
    table.enu('cost_per', ['month', 'week', 'day', 'days']);
    table.integer('bedrooms');
    table.integer('bathroooms');
    table.enu('housing_type', ['condo', 'apt', 'house']);
    table.boolean('rent');
    table.boolean('own');
    table.boolean('roommates');
    table.integer('roommates_min');
    table.integer('roommates_max');
    table.boolean('allow_pets');
    table.boolean('allow_smoking');
    table.boolean('laundry');
    table.boolean('parking');
    table.integer('parking_cost');
    table.boolean('all_utilities_inc');
    table.boolean('heat_inc');
    table.boolean('wifi_inc');
    table.boolean('water_inc');
    table.boolean('electricity_inc');
    table.boolean('garbage_inc');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('listings');
};

