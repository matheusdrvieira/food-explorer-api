const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/diskStorage");

class DishImage {
    async update(request, response) {
        const { id } = request.params;
        const imageFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const dish = await knex("DISH")
            .where({ id })
            .first();

        if (!dish) {
            throw new AppError("Prato não encontrado", 404);
        }

        if (dish.image) {
            await diskStorage.deleteFile(dish.image);
        }

        dish.image = imageFilename;

        await knex("DISH")
            .where({ id })
            .update({ image: imageFilename });

        return response.json(dish);
    }
}

module.exports = DishImage;