const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");
const UserRepository = require("../repositories/user/userRepository");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body

        try {
            const userRepository = new UserRepository()
            const user = await userRepository.findByEmail(email);

            if (!user.email) {
                throw new AppError("E-mail e/ou senha incorreta", 401);
            }

            const passwordMatched = await compare(password, user.password);

            if (!passwordMatched) {
                throw new AppError("E-mail e/ou senha incorreta", 401);
            }

            const { secret } = authConfig.jwt;
            const token = sign({ user_id: user.id, is_admin: Boolean(user.is_admin) }, secret);

            return response.json({ user, token })
        } catch (error) {

            return response.status().json({ error: "internal server error" });
        }
    }
}

module.exports = SessionsController;