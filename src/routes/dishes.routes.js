const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/dishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER_IMAGE);

const dishController = new DishesController();

dishesRoutes.post("/", ensureAuthenticated(true), upload.single("image"), dishController.create);
dishesRoutes.get("/:id", ensureAuthenticated(false), dishController.show);
dishesRoutes.delete("/:id", ensureAuthenticated(true), dishController.delete);
dishesRoutes.get("/", ensureAuthenticated(false), dishController.index);
dishesRoutes.put("/:id", ensureAuthenticated(true), upload.single("image"), dishController.update);

module.exports = dishesRoutes;