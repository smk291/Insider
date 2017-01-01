'use strict';

exports.up = (knex) => {
  return knex.schema.hasTable('listings', (table) => {
//     table.increments();
//     table.string('url').notNullable().unique()
//     table.string('urlnum').notNullable().unique();
//     table.string('post_date').notNullable().defaultTo('');
//     table.string('title').notNullable().defaultTo('No title provided');
//     table.jsonb('photos');
//     table.integer('bedrooms');
//     table.integer('sqft');
//     table.text('descr', 'utf-8');
//     table.text('notes', 'utf-8');
//     table.integer('price');
//     table.string('neighborhood').notNullable().defaultTo('');
//     table.string('location').notNullable().defaultTo('');
//     table.string('street_address').defaultTo('');
//     table.string('state').defaultTo('');
//     table.string('zip').defaultTo('');
//     table.string('lat').defaultTo('');
//     table.string('lon').defaultTo('');
//     table.string('cross_streets').defaultTo('');
//     // table.enu('cost_per', ['month', 'week', 'day', 'days']);
//     // table.enu('housing_type', ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin']);
//     // // table.boolean('apt_in_house');
//     // //date, title, photos, br_sqft, place, url, price
//     // table.enu('laundry_types', ['laundry on site', 'w/d in unit', 'laundry in bldg', null]).defaultTo(null);
//     // table.enu('parking_types', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null]).defaultTo(null);
//     // table.enu(bath_types, ['private bath', 'no private bath', null]).defaultTo(null);
//     // table.enu('private_room_types', ['private room', 'room not private', null]).defaultTo(null);
//     // table.enu('cat_types', ['cats are OK - purrr', null]).defaultTo(null);
//     // table.enu('dog_types', ['dogs are OK - wooof', null]).defaultTo(null);
//     // table.enu('furnished_types', ['furnished', null]).defaultTo(null);
//     // table.enu('smoking_types', ['no smoking', null]).defaultTo(null);
//     // table.enu('wheelchair_types', ['wheelchair accessible', null]).defaultTo(null);
//     // // table.boolean('apt_in_house');
//     // //date, title, photos, br_sqft, place, url, price
//     // CREATE TYPE housing_type AS enum ('apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin', 'null');
//     // ALTER TABLE listings ADD VALUE housing_type;
//     //
//     // ALTER TABLE listings ADD COLUMN laundry_types TYPE enum ('laundry on site', 'w/d in unit', 'laundry in bldg', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN parking_types TYPE enum ('off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN ath_types TYPE enum ('private bath', 'no private bath', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN private_room_types TYPE enum ('private room', 'room not private', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN cat_types TYPE enum ('cats are OK - purrr', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN dog_types TYPE enum ('dogs are OK - wooof', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN furnished_types TYPE enum ('furnished', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN smoking_types TYPE enum ('no smoking', null) SET DEFAULT null
//     // ALTER TABLE listings ADD COLUMN wheelchair_types TYPE enum ('wheelchair accessible', null) SET DEFAULT null
//     table.boolean('all_utilities_inc');
//     table.boolean('heat_inc');
//     table.boolean('wifi_inc');
//     table.boolean('water_inc');
//     table.boolean('electricity_inc');
//     table.boolean('garbage_inc');
//     table.timestamps(true, true);
  });
};


exports.down = (knex) => {
  return knex.schema.dropTable('listings');
};

