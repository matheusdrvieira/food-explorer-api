const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/diskStorage");

class UserAvatar {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        try {
            const diskStorage = new DiskStorage();

            const user = await knex("USERS")
                .where({ id: user_id }).first();

            if (!user) {
                throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
            }

            if (user.avatar) {
                await diskStorage.deleteFile(user.avatar);
            }

            user.avatar = avatarFilename;

            await knex("USERS").update(user).where({ id: user_id });

            return response.json(user);
        } catch (error) {

            return response.status().json({ error: "internal server error" });
        }
    }
}

module.exports = UserAvatar;
