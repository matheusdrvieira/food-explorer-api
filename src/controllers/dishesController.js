const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
    async create(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const imageFilename = request.file.filename;



        try {
            const dish = await knex("DISH").insert({
                name,
                description,
                category_id: category,
                price,
                image: imageFilename
            });

            const splitIngredients = ingredients[0].split(",")

            const ingredientsInsert = splitIngredients.map(ingredient => {
                return {
                    "dish_id": dish[0],
                    name: ingredient
                }
            });

            await knex("INGREDIENT").insert(ingredientsInsert);

            return response.status(200).json({ message: "Prato criado com sucesso" });
        } catch (error) {

            throw new AppError(error.message, 500);
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

            throw new AppError(error.message, 500);
        }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            await knex.transaction(async dish => {
                await dish("DISH")
                    .where({ id })
                    .delete();
            });

            return response.json({ message: "Prato deletado com sucesso" });
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }

    async index(request, response) {
        const { name, ingredient } = request.query;

        try {
            let dishes = await knex("DISH as d")
                .select(["d.id",
                    "d.name",
                    "d.description",
                    "d.category_id",
                    " d.image",
                    "d.price"
                ])
                .distinct()
                .whereLike("d.name", `%${name}%`)
                .orWhereLike("i.name", `%${ingredient}%`)
                .leftJoin("INGREDIENT as I", "d.id", "i.dish_id")
                .orderBy("d.name");

            return response.json(dishes);
        } catch (error) {

            throw new AppError(error.message, 500);
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

            throw new AppError(error.message, 500);
        }
    }

}

module.exports = DishesController;