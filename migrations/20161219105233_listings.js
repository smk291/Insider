'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('listings', (table) => {
    table.increments();
    table.string('url').notNullable().unique()
    table.string('urlnum').notNullable().unique();
    table.string('post_date').notNullable().defaultTo('');
    table.string('title').notNullable().defaultTo('No title provided');
    table.jsonb('photos');
    table.integer('bedrooms');
    table.integer('sqft');
    table.text('descr', 'utf-8');
    table.text('notes', 'utf-8');
    table.integer('price');
    table.string('neighborhood').notNullable().defaultTo('');
    table.string('location').notNullable().defaultTo('');
    table.string('street_address').defaultTo('');
    table.string('state').defaultTo('');
    table.string('zip').defaultTo('');
    table.string('lat').defaultTo('');
    table.string('lon').defaultTo('');
    table.string('cross_streets').defaultTo('');
    table.enu('cost_per', ['month', 'week', 'day', 'days']);
    table.integer('bathroooms');
    // table.enu('housing_type', ['condo', 'apt', 'house', 'other']);
    // table.boolean('apt_in_house');
    // table.boolean('rent');
    // table.boolean('own');
    //date, title, photos, br_sqft, place, url, price
    table.boolean('roommates');
    table.integer('roommates_num');
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

