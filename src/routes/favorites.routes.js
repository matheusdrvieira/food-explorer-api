const { Router } = require("express");

const FavoriteController = require("../controllers/favoriteController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favoritesRoutes = Router();
const favoriteController = new FavoriteController();

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.post("/:id", favoriteController.create);
favoritesRoutes.delete("/:id", favoriteController.delete);

module.exports = favoritesRoutes;