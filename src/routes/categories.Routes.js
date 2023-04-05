const { Router } = require("express");
const CategoryController = require("../controllers/categoryController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const categoriesRoutes = Router();

const categoryController = new CategoryController();

categoriesRoutes.get("/", ensureAuthenticated(false), categoryController.index);

module.exports = categoriesRoutes;