exports.up = knex => {
  return knex.schema.createTable('users_listings', table => {
    table.increments();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.integer('listings_sub_id')
      .references('id')
      .inTable('listings_sub')
      .onDelete('CASCADE')
      .index();
    table.integer('listings_apt_id')
      .references('id')
      .inTable('listings_apt')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTableIfExists('users_listings');