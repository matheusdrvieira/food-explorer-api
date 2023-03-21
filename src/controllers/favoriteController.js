const knex = require("../database/knex");

class FavoriteController {
    async create(request, response) {
        const user_id = request.user.id;
        const dish_id = request.params.id;

        try {
            const favorite = await knex("FAVORITE")
                .where({
                    user_id: user_id,
                    dish_id: dish_id
                })
                .first();

            if (favorite) {
                return response.status(400).json({ error: "This dish is already in your favorites" });
            }

            await knex("FAVORITE").insert({
                user_id: user_id,
                dish_id: dish_id
            });

            return response.status(201).json({ message: "dish successfully added" });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }

    async delete(request, response) {
        const user_id = request.user.id;
        const dish_id = request.params.id;

        try {
            const favorite = await knex("FAVORITE")
                .where({
                    user_id: user_id,
                    dish_id: dish_id
                })
                .first();

            if (!favorite) {
                return response.status(400).json({ error: "This dish is not in your favorites" });
            }

            await knex("FAVORITE")
                .where({
                    user_id: user_id,
                    dish_id: dish_id
                })
                .delete();

            return response.status(200).json({ message: "successfully deleted dish" });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = FavoriteController;
