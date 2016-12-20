'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('housing_searches', (table) => {
    table.increments();
    table.string('location').notNullable().defaultTo('');
    //table.string('zone').notNullable().defaultTo('');
    table.integer('cost_min');
    table.integer('cost_max');
    table.integer('bedrooms_min');
    table.integer('bedrooms_max');
    table.integer('bathroooms_min');
    table.integer('bathroooms_max');
    table.enu('housing_type', ['condo', 'apt', 'house', 'other'])
    table.boolean('rent');
    table.boolean('own');
    table.integer('roommates_min');
    table.integer('roommates_max');
    table.boolean('allow_pets');
    table.boolean('allow_smoking');
    table.boolean('laundry');
    table.integer('laundry_cost');
    table.boolean('parking');
    table.integer('parking_cost');
    table.boolean('all_utilities_inc');
    table.boolean('heat_inc');
    table.boolean('wifi_inc');
    table.boolean('water_inc');
    table.boolean('electricity_inc');
    table.boolean('garbage_inc');
    table.text('descr', 'utf-8');
    table.text('notes', 'utf-8');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('housing_searches');
};