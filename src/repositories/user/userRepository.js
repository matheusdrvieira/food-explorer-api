const knex = require("../../database/knex");

class UserRepository {
    async findByEmail(email) {
        const userEmail = await knex('USERS').where({ email }).first();

        return userEmail;
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
        const userId = await knex('USERS').where({ id }).first();

        return userId;
    }

    async update({ id, name, email, password, updated_at }) {
        const updateUserId = await knex('USERS')
            .update({
                id,
                name,
                email,
                password,
                updated_at
            });

        console.log(updateUserId);

        return { id: updateUserId };
    }
}

module.exports = UserRepository;