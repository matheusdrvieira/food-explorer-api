const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientController {
    async index(request, response) {
        const dish_id = request.params.id;

        try {
            const ingredient = await knex("INGREDIENT")
                .where({ dish_id: dish_id })

            return response.json(ingredient);

        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }
}

module.exports = IngredientController;