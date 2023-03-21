const knex = require("../database/knex");

class UserRepository {
    const user = await knex('USERS').where({ email }).first();

}

module.exports = UserRepository;