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

    async update(request, response) {
        const { name, email, old_Password, password } = request.body;
        const id = request.user.id;

        try {
            const user = await knex('USERS').where({ id }).first();

            if (!user) {
                return response.status(400).json({ message: 'User not found.' });
            }

            if (email && email !== user.email) {
                const emailExists = await knex('USERS').where({ email }).first();

                if (emailExists) {
                    return response.status(400).json({ message: 'Email already registered.' });
                }
            }

            if (old_Password && !(await bcrypt.compare(old_Password, user.password))) {
                return response.status(401).json({ message: 'Invalid password.' });
            }

            const hashedPassword = password ? await bcrypt.hash(password, 8) : user.password;

            const updatedUser = {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword,
                updated_at: new Date(),
            };

            await knex('USERS').where({ id }).update(updatedUser);

            return response.status(200).json({ message: 'User updated successfully!' });
        } catch (error) {
            console.error(error);

            return response.status(500).json({ message: 'Error updating user.' });
        }
    }
}

module.exports = UsersController;