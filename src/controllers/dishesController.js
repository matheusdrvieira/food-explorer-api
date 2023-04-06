const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/diskStorage");

class DishesController {
    async create(request, response) {
        const { name, description, category, price, ingredients } = request.body;
        const imageFilename = request.file ? request.file.filename : null;

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
        const { name, description, category, price, ingredients } = request.body;
        const imageFilename = request.file ? request.file.filename : null;

        try {
            const diskStorage = new DiskStorage();

            const dish = await knex("DISH")
                .where({ id: dishId })
                .first();

            if (!dish) {
                throw new AppError("Prato não encontrado", 404);
            }

            if (dish.image && imageFilename != null) {
                await diskStorage.deleteFile(dish.image);
            }

            await knex('DISH')
                .where({ id: dishId })
                .update({
                    name,
                    description,
                    category_id: category,
                    image: imageFilename ? imageFilename : dish.image,
                    price,
                    updated_at: knex.fn.now()
                });

            await knex('INGREDIENT')
                .where({ dish_id: dishId })
                .delete();

            const splitIngredients = ingredients[0].split(",")

            const ingredientsUpdate = splitIngredients.map(ingredient => {
                return {
                    dish_id: dishId,
                    name: ingredient
                }
            })

            await knex("INGREDIENT").insert(ingredientsUpdate);

            return response.json({ message: "Prato atualizado com sucesso" });
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }
}

module.exports = DishesController;