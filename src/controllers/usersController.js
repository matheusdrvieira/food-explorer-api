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
            const userRepository = new UserRepository()

            const checkUserId = await userRepository.findById(id);

            if (!checkUserId) {
                return response.status(400).json({ message: 'Usuário não encontrado.' });
            }

            if (checkUserId.email && email !== checkUserId.email) {
                return response.status(400).json({ message: 'E-mail já registrado.' });
            }

            if (checkUserId.password && (await bcrypt.compare(old_Password, checkUserId.password))) {
                var hashedPassword = checkUserId.password ? await bcrypt.hash(password, 8) : checkUserId.password;

            } else {
                return response.status(401).json({ message: 'Senha inválida.' });
            }

            const updatedUser = {
                name: name || checkUserId.name,
                email: email || checkUserId.email,
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