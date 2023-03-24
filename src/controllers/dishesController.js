const knex = require("../database/knex");

class DishesController {
    async create(request, response) {
        const { name, description, category, image, price, ingredients } = request.body;

        try {
            const dish = await knex("DISH").insert({
                name,
                description,
                category_id: category,
                image,
                price
            });

            const ingredientsInsert = ingredients.map(name => {
                return {
                    "dish_id": dish[0],
                    name
                }
            });

            await knex("INGREDIENT").insert(ingredientsInsert);

            return response.status(200).json({ message: "Prato criado com sucesso" });
        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }

    async show(request, response) {
        const { id } = request.params;

        try {
            const dish = await knex("DISH").where({ id }).first();
            const ingredients = await knex("INGREDIENT").where({ dish_id: id }).orderBy("name");

            return response.json({
                ...dish,
                ingredients
            });
        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const ingredient_id = await knex("INGREDIENT")
                .where({ dish_id: id })
                .pluck("id");

            await knex.transaction(async trx => {

                await trx("INGREDIENT")
                    .whereIn("id", ingredient_id)
                    .delete();

                await trx("DISH")
                    .where({ id })
                    .delete();
            });

            return response.json({ message: "Prato deletado com sucesso" });
        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }

    async index(request, response) {
        const { name, ingredient } = request.query;

        try {
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
        } catch (error) {

            return response.status(500).json({ error: "internal server error" });
        }
    }

    async update(request, response) {
        const dishId = request.params.id;
        const { name, description, category, image, price, ingredients } = request.body;

        try {
            await knex('DISH')
                .where({ id: dishId })
                .update({
                    name,
                    description,
                    category_id: category,
                    image,
                    price,
                    updated_at: knex.fn.now()
                });

            const ingredient = await knex('INGREDIENT')
                .where({ dish_id: dishId })
                .select('id', 'name');


            const currentIngredientsObj = {};
            ingredient.forEach(ing => {
                currentIngredientsObj[ing.name] = ing;
            });

            for (const ing of ingredients) {
                const currentIng = currentIngredientsObj[ing];

                if (currentIng) {
                    await knex('INGREDIENT')
                        .where({ id: currentIng.id })
                        .update({ name: ing });
                    delete currentIngredientsObj[ing];

                } else {
                    await knex('INGREDIENT').insert({
                        name: ing,
                        dish_id: dishId
                    });
                }
            }

            const deletedIngredients = Object.values(currentIngredientsObj);

            if (deletedIngredients.length > 0) {
                const deletedIds = deletedIngredients.map(ing => ing.id);
                await knex('INGREDIENT').whereIn('id', deletedIds).delete();
            }

            return response.json({ message: "Prato atualizado com sucesso" });
        } catch (error) {

            return response.status(500).json({ error: 'Não foi possível atualizar o produto' });
        }
    }

}

module.exports = DishesController;