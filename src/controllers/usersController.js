const AppError = require("../utils/AppError");
const bcrypt = require('bcryptjs');
const knex = require("../database/knex");
const UserRepository = require("../repositories/user/userRepository");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const userRepository = new UserRepository()

        const checkUserExists = await userRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError("E-mail já registrado.");
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await userRepository.create({ name, email, password: hashedPassword });

        return response.status(201).json({ message: 'Usuário criado com sucesso!' });
    }

    async update(request, response) {
        const { name, email, old_Password, password } = request.body;
        const id = request.user.id;

        try {
            const user = await knex('USERS').where({ id }).first();

            if (!user) {
                return response.status(400).json({ message: 'Usuário não encontrado.' });
            }

            if (email && email !== user.email) {
                const emailExists = await knex('USERS').where({ email }).first();

                if (emailExists) {
                    return response.status(400).json({ message: 'E-mail já registrado.' });
                }
            }

            if (old_Password && !(await bcrypt.compare(old_Password, user.password))) {
                return response.status(401).json({ message: 'Senha inválida.' });
            }

            const hashedPassword = password ? await bcrypt.hash(password, 8) : user.password;

            const updatedUser = {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword,
                updated_at: new Date(),
            };

            await knex('USERS').where({ id }).update(updatedUser);

            return response.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (error) {
            console.error(error);

            return response.status(500).json({ message: 'Erro ao atualizar o usuário.' });
        }
    }
}

module.exports = UsersController;