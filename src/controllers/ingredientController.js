const knex = require("../database/knex");

class IngredientController {
    async index(request, response) {
        const dish_id = request.params.id;

        try {
            const ingredient = await knex("INGREDIENT")
                .where({ dish_id: dish_id })

            return response.json(ingredient);

        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }
}

module.exports = IngredientController;