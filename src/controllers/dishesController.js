const knex = require("../database/knex");

class DishesController {
    async create(request, response) {
        const { name, description, category, image, price, ingredients } = request.body;
        const user_id = request.user.id;

        const dish = await knex("DISH").insert({
            name,
            description,
            category,
            image,
            price,
            user_id
        });

        const tagsInsert = ingredients.map(name => {
            return {
                "dish_id": dish[0],
                name
            }
        });

        await knex("INGREDIENT").insert(tagsInsert);

        return response.json();
    }

    async show(request, response) {
        const { id } = request.params;
        const dish = await knex("DISH").where({ id }).first();
        const tags = await knex("INGREDIENT").where({ dish_id: id }).orderBy("name");

        return response.json({
            ...dish,
            tags
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        const ingredientIds = await knex("INGREDIENT")
            .where({ dish_id: id })
            .pluck("id");

        await knex.transaction(async trx => {

            await trx("INGREDIENT")
                .whereIn("id", ingredientIds)
                .delete();

            await trx("DISH")
                .where({ id })
                .delete();
        });

        return response.json();
    }

    async index(request, response) {
        const { name, ingredient } = request.query;

        let dishes = await knex("DISH as d")
            .select("d.*")
            .distinct()
            .whereLike("d.name", `%${name == "" ? null : name}%`)
            .orWhereLike("i.name", `%${ingredient == "" ? null : ingredient}%`)
            .leftJoin("INGREDIENT as I", "d.id", "i.dish_id")
            .orderBy("d.name");

        await Promise.all(dishes.map(async dish => {
            const ingredients = await knex("INGREDIENT").select("id", "name").where({ "dish_id": dish.id })

            dish.ingredient = ingredients
        }));

        return response.json(dishes);
    }
}

module.exports = DishesController;
