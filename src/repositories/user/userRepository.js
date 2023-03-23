const knex = require("../../database/knex");

class UserRepository {
    async findByEmail(email) {
        const user = await knex('USERS').where({ email }).first();

        return user;
    }

    async create({ name, email, password }) {
        const user_id = await knex('USERS').insert({
            name,
            email,
            password
        });

        return { id: user_id };
    }

    async findById(id) {
        const user_id = await knex('USERS').where({ id }).first();

        return user_id;
    }

    async findByPassword(password) {
        const checkPassword = await knex('USERS').where({ password }).first();

        return checkPassword;
    }
}

module.exports = UserRepository;