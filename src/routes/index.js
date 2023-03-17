const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const dishesRouter = require("./dishes.routes");
const tagsRouter = require("./tags.Routes");
const ordersRouter = require("./orders.routes");

const routes = Router();
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/tags", tagsRouter);
routes.use("/orders", ordersRouter);

module.exports = routes;