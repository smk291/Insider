'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('housing_searches', (table) => {
    table.increments();
    table.string('location').notNullable().defaultTo('');
    //table.string('zone').notNullable().defaultTo('');
    table.integer('cost_min');
    table.integer('cost_max');
    table.integer('bedrooms');
    table.integer('bathroooms');
    table.enu('housing_type', ['condo', 'apt', 'house'])
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
  return knex.schema.dropTable('housing_searches');
};



//housing searches:
  // id
  // location
  // zone
  // cost_min
  // cost_max
  // bedrooms
  // bathrooms
  // housing_type
  // rent_own
  // roommates
  // pets
  // smoking
  // laundry