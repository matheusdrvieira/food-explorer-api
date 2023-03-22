const knex = require("../../database/knex");

class IngredientRepository {
    async findByEmail(email) {
        const user = await knex('USERS').where({ email }).first();

        return user;
    }
}

module.exports = IngredientRepository;