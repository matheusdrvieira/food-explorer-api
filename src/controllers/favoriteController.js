const knex = require("../database/knex");

class FavoriteController {
    async create(request, response) {
        const user_id = request.user.id;
        const { dish_id } = request.body;

        try {
            const favorite = await knex("FAVORITE")
                .where({
                    user_id: user_id,
                    dish_id: dish_id
                })
                .first();

            if (favorite) {
                return response.status(400).json({ error: "Este prato já está nos seus favoritos" });
            }

            await knex("FAVORITE").insert({
                user_id: user_id,
                dish_id: dish_id
            });

            return response.status(201).json({ message: "Prato adicionado com sucesso" });

        } catch (error) {

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
                return response.status(400).json({ error: "Este prato não está nos seus favoritos" });
            }

            await knex("FAVORITE")
                .where({
                    user_id: user_id,
                    dish_id: dish_id
                })
                .delete();

            return response.status(200).json({ message: "Prato removido com sucesso" });

        } catch (error) {

            return response.status(500).json({ error: "Internal server error" });
        }
    }

    async index(request, response) {
        const user_id = request.user.id;

        try {
            const favorites = await knex("FAVORITE as FV")
                .select("D.*")
                .innerJoin("DISH as D", "D.id", "FV.dish_id")
                .where({ "FV.user_id": user_id })

            return response.json({ favorites });
        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }
}

module.exports = FavoriteController;