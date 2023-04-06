const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const dishesRouter = require("./dishes.routes");
const ordersRouter = require("./orders.routes");
const favoritesRoutes = require("./favorites.routes");
const categoriesRoutes = require("./categories.Routes");

const routes = Router();
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/orders", ordersRouter);
routes.use("/favorites", favoritesRoutes);
routes.use("/categories", categoriesRoutes);

module.exports = routes;