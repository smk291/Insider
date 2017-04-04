// eslint-disable-next-line func-names
exports.seed = function (knex) {
  return knex('users_listings').del()
    .then(() => {
      return knex('users_listings').insert([{
        id: 1,
        listings_id: 1,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 2,
        listings_id: 2,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 3,
        listings_id: 3,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 4,
        listings_id: 4,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 5,
        listings_id: 5,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 6,
        listings_id: 6,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 7,
        listings_id: 7,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 8,
        listings_id: 8,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 9,
        listings_id: 9,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }, {
        id: 10,
        listings_id: 10,
        user_id: 1,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC'),
      }]);
    })
    .then(() => {
      return knex.raw('SELECT setval(\'users_listings_id_seq\', (SELECT MAX(id) FROM users_listings));');
    });
};
