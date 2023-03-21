const { Router } = require("express");
const OrdersController = require("../controllers/orderController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ordersRoutes = Router();

const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);
ordersRoutes.delete("/:id", ordersController.delete);

module.exports = ordersRoutes;