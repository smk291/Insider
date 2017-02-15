exports.seed = function(knex) {
  return knex('users_listings').del()
    .then(() => {
      return knex('users_listings').insert([{
        id: 1,
        user_id: 1,,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },{
        id: 1,
        user_id: 2,,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },{
        id: 1,
        user_id: 3,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },{
        id: 1,
        user_id: 4,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },{
        id: 1,
        user_id: 5,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },{
        id: 1,
        user_id: 6,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },]);
      },{
        id: 1,
        user_id: 7,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },]);
      },{
        id: 1,
        user_id: 8,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },]);
      },{
        id: 1,
        user_id: 9,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },]);
      },{
        id: 1,
        user_id: 10,
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      },]);
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_listings_id_seq', (SELECT MAX(id) FROM users_listings));"
      );
    });
};
