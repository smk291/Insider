'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('housing_searches', (table) => {
    table.increments();
    table.string('bedrooms');
    table.integer('bedrooms_importance');
    table.string('sqft');
    table.integer('sqft_importance');
    table.text('notes', 'utf-8');
    table.integer('price');
    table.integer('price_importance');
    table.jsonb('housing_type');
    table.integer('housing_type_importance');
    table.jsonb('laundry_types');
    table.integer('laundry_types_importance');
    table.jsonb('parking_types');
    table.integer('parking_types_importance');
    table.boolean('bath_types');
    table.integer('bath_types_importance');
    table.boolean('private_room_types');
    table.integer('private_room_types_importance');
    table.boolean('cat_types');
    table.integer('cat_types_importance');
    table.boolean('dog_types');
    table.integer('dog_types_importance');
    table.boolean('furnished_types');
    table.integer('furnished_types_importance');
    table.boolean('smoking_types');
    table.integer('smoking_types_importance');
    table.boolean('wheelchair_types');
    table.integer('wheelchair_types_importance');
    table.boolean('sub_or_apt');
    table.boolean('sub_or_apt_importance');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('housing_searches');
};