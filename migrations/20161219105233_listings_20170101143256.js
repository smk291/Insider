'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('listings', (table) => {
    table.increments();
    table.string('url').notNullable().unique()
    table.string('urlnum').notNullable().unique();
    table.string('post_date').notNullable().defaultTo('');
    table.string('title').notNullable().defaultTo('No title provided');
    table.jsonb('photos');
    table.string('bedrooms');
    table.string('sqft');
    table.text('descr', 'utf-8');
    table.integer('price');
    table.string('neighborhood').notNullable().defaultTo('');
    table.string('street_address').defaultTo('');
    table.string('state').defaultTo('');
    table.string('zip').defaultTo('');
    table.string('lat').defaultTo('');
    table.string('lon').defaultTo('');
    table.boolean('void');
    table.boolean('checked');
    table.enu('housing', ['apartment', 'condo', 'house', 'townhouse', 'duplex', 'land', 'in-law', 'cottage/cabin']);
    table.enu('laundry', ['laundry on site', 'w/d in unit', 'laundry in bldg', null]).defaultTo(null);
    table.enu('parking', ['off-street parking', 'detached garage', 'attached garage', 'valet parking', 'street parking', 'carport', 'no parking', null]).defaultTo(null);
    table.enu('bath', ['private bath', 'no private bath', null]).defaultTo(null);
    table.enu('private_room', ['private room', 'room not private', null]).defaultTo(null);
    table.enu('cat', ['cats are OK - purrr', null]).defaultTo(null);
    table.enu('dog', ['dogs are OK - wooof', null]).defaultTo(null);
    table.enu('furnished', ['furnished', null]).defaultTo(null);
    table.enu('smoking', ['no smoking', null]).defaultTo(null);
    table.enu('wheelchair', ['wheelchair accessible', null]).defaultTo(null);
    table.enu('sub_or_apt', ['sub', 'apt']);
    table.timestamp('last_checked').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};


exports.down = (knex) => {
  return knex.schema.dropTableIfExists('listings');
};

