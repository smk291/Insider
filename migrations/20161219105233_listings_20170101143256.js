  exports.up = knex => {
  return knex.schema.createTable('listings', table => {
    table.increments();
    table.integer('bedrooms');
    table.text('descr', 'utf-8');
    table.decimal('lat', 10, 7);
    table.decimal('lon', 10, 7);
    table.string('neighborhood');
    table.specificType('photos', 'text[]');
    table.timestamp('post_date').notNullable();
    table.integer('price');
    table.integer('sqft');
    table.string('street_address').defaultTo('');
    table.string('title').notNullable().defaultTo('No title provided');
    table.string('url').notNullable();
    table.bigInteger('urlnum').defaultTo(null).notNullable().unique();
    table.boolean('void');
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
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTableIfExists('listings');
