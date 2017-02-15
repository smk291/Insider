exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        first_name: 'Sam',
        last_name: 'K',
        email: 's@k.c',
        hashed_password: '$2a$12$j3z2x/C6pnTWIn6Aezv6de.cGeXMXlpoFzi5lIzPUnoda9d/ir4Zy',//qweqweqwe
        created_at: new Date('2016-06-26 14:26:16 UTC'),
        updated_at: new Date('2016-06-26 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        'SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));'
      );
    });
};
