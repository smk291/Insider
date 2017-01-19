'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('listings', (table) => {
    table.increments();
    table.string('url').notNullable().unique()
    table.string('urlnum').notNullable().unique();
    table.string('post_date').notNullable().defaultTo('');
    table.string('title').notNullable().defaultTo('No title provided');
    table.jsonb('photos');
    table.boolean('emptypage');
    table.string('bedrooms');
    table.string('sqft');
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
    table.boolean('void');
    table.boolean('checked');
    table.enu('housing_type', ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin']);
    table.enu('laundry_types', ['laundry on site', 'w/d in unit', 'laundry in bldg', null]).defaultTo(null);
    table.enu('parking_types', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null]).defaultTo(null);
    table.enu('bath_types', ['private bath', 'no private bath', null]).defaultTo(null);
    table.enu('private_room_types', ['private room', 'room not private', null]).defaultTo(null);
    table.enu('cat_types', ['cats are OK - purrr', null]).defaultTo(null);
    table.enu('dog_types', ['dogs are OK - wooof', null]).defaultTo(null);
    table.enu('furnished_types', ['furnished', null]).defaultTo(null);
    table.enu('smoking_types', ['no smoking', null]).defaultTo(null);
    table.enu('wheelchair_types', ['wheelchair accessible', null]).defaultTo(null);
    table.enu('sub_or_apt', ['sub', 'apt']);
    table.boolean('void'); // NEW
    table.timestamp('last_checked').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};


exports.down = (knex) => {
  return knex.schema.dropTableIfExists('listings');
};

