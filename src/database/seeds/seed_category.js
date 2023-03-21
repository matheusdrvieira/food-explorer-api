exports.seed = async function (knex) {

  await knex('CATEGORY').del()

  await knex('CATEGORY').insert([
    { name: 'Pratos Principais' },
    { name: 'Sobresas' },
    { name: 'Bebidas' }
  ]);
};
