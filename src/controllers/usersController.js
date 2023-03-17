const AppError = require("../utils/AppError");
const bcrypt = require('bcryptjs');
const knex = require("../database/knex");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const user = await knex('USERS').where({ email }).first();

        if (user) {
            throw new AppError("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        try {
            await knex('USERS').insert({
                name,
                email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            });

            return response.status(201).json({ message: 'User created successfully!' });

        } catch (error) {
            return response.status(500).json({ error: 'Error creating user.' });
        }
    }
}

module.exports = UsersController;