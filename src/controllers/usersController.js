const AppError = require("../utils/AppError");
const bcrypt = require('bcryptjs');
const knex = require("../database/knex");
const UserRepository = require("../repositories/user/userRepository");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try {
            const userRepository = new UserRepository();
            const checkUserExists = await userRepository.findByEmail(email);

            if (checkUserExists) {
                throw new AppError("E-mail já registrado.");
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            await userRepository.create({ name, email, password: hashedPassword });

            return response.status(201).json({ message: 'Usuário criado com sucesso!' });

        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }

    async update(request, response) {
        const { name, email, old_Password, password } = request.body;
        const id = request.user.id;

        try {
            const userRepository = new UserRepository();
            const user = await userRepository.findById(id);

            if (!user) {
                return response.status(400).json({ message: 'Usuário não encontrado.' });
            }

            const userWithUpdatedEmail = await userRepository.findByEmail(email);

            if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
                return response.status(400).json({ message: 'E-mail já registrado.' });
            }

            user.name = name ?? user.name;
            user.email = email ?? user.email;

            if (password && !old_Password) {
                throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
            }

            if (password && old_Password) {

                const checkOldPassword = await bcrypt.compare(old_Password, user.password);

                if (!checkOldPassword) {
                    throw new AppError("A senha antiga nao confere.");
                }

                user.password = await bcrypt.hash(password, 8);
            }

            await userRepository
                .update({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    updated_at: knex.fn.now()
                });


            return response.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (error) {

            throw new AppError(error.message, 500)
        }
    }

    async index(request, response) {
        const { startDate, endDate } = request.query;


        try {
            const userRepository = new UserRepository();
            const orders = await userRepository.index(startDate, endDate);

            return response.status(200).json({ orders });
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }
}

module.exports = UsersController;

