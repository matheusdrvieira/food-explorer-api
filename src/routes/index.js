const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const dishesRouter = require("./dishes.routes");
const ingredientsRouter = require("./ingredients.Routes");
const ordersRouter = require("./orders.routes");
const favoritesRoutes = require("./favorites.routes");

const routes = Router();
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/orders", ordersRouter);
routes.use("/favorites", favoritesRoutes);

module.exports = routes;