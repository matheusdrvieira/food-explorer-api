const knex = require("../database/knex");

class IngredientController {
    async index(request, response) {
        const dish_id = request.params.id;

        const ingredient = await knex("INGREDIENT")
            .where({ dish_id: dish_id })

        return response.json(ingredient);
    }
}

module.exports = IngredientController;