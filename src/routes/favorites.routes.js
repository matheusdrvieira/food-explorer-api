const { Router } = require("express");

const FavoriteController = require("../controllers/favoriteController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favoritesRoutes = Router();
const favoriteController = new FavoriteController();

favoritesRoutes.use(ensureAuthenticated(false));

favoritesRoutes.post("/", favoriteController.create);
favoritesRoutes.delete("/:id", favoriteController.delete);
favoritesRoutes.get("/", favoriteController.index);

module.exports = favoritesRoutes;