const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/dishesController");
const DishImage = require("../controllers/dishImage");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER_IMAGE);

const dishController = new DishesController();
const dishImage = new DishImage();

dishesRoutes.post("/", ensureAuthenticated(true), dishController.create);
dishesRoutes.get("/:id", ensureAuthenticated(false), dishController.show);
dishesRoutes.delete("/:id", ensureAuthenticated(true), dishController.delete);
dishesRoutes.get("/", ensureAuthenticated(false), dishController.index);
dishesRoutes.put("/:id", ensureAuthenticated(true), dishController.update);
dishesRoutes.patch("/:id/image", ensureAuthenticated(true), upload.single("image"), dishImage.update);

module.exports = dishesRoutes;