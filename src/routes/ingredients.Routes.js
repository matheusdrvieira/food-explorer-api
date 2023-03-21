const { Router } = require("express");
const IngredientController = require("../controllers/ingredientController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ingredientsRoutes = Router();

const ingredientController = new IngredientController();

ingredientsRoutes.get("/:id", ensureAuthenticated, ingredientController.index);

module.exports = ingredientsRoutes;