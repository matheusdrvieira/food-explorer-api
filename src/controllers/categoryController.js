const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class CategoyController {
    async index(request, response) {
        try {
            const category = await knex("CATEGORY")
                .select([
                    "CATEGORY.id",
                    "CATEGORY.name"
                ])

            return response.json(category);

        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }
}

module.exports = CategoyController;