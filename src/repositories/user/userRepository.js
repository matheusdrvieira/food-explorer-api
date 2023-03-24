const knex = require("../../database/knex");

class UserRepository {
    async findByEmail(email) {
        const userEmail = await knex('USERS').where({ email }).first();

        return userEmail;
    }

    async create({ name, email, password }) {
        const createUserId = await knex('USERS').insert({
            name,
            email,
            password
        });

        return { id: createUserId };
    }

    async findById(id) {
        const userId = await knex('USERS').where({ id }).first();

        return userId;
    }

    async update({ id, name, email, password, updated_at }) {
        const updateUserId = await knex('USERS')
            .where({ id })
            .update({
                id,
                name,
                email,
                password,
                updated_at
            })

        return { id: updateUserId };
    }

    async index(startDate, endDate) {
        const orders = await knex("ORDER").whereBetween("ORDER.created_at", [startDate, endDate])

        await Promise.all(orders.map(async order => {
            const dishes = await knex("ORDER_DISH as OD")
                .select("D.name", "OD.quantity")
                .innerJoin("DISH as D", "D.id", "OD.dish_id")
                .where({ order_id: order.id })

            order.dishes = dishes;
        }));

        return orders;
    }
}

module.exports = UserRepository;