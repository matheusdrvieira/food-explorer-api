const { Router } = require("express");
const OrdersController = require("../controllers/orderController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ordersRoutes = Router();

const ordersController = new OrdersController();

ordersRoutes.post("/", ensureAuthenticated(false), ordersController.create);
ordersRoutes.get("/", ensureAuthenticated(false), ordersController.index);
ordersRoutes.patch("/:id", ensureAuthenticated(true), ordersController.updateStatus);
ordersRoutes.put("/:id", ensureAuthenticated(false), ordersController.updateOrder);

module.exports = ordersRoutes;