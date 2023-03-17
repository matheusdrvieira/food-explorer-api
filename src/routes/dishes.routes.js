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

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", dishController.create);
dishesRoutes.get("/:id", dishController.show);
dishesRoutes.delete("/:id", dishController.delete);
dishesRoutes.get("/", dishController.index);
dishesRoutes.patch("/:id/image", ensureAuthenticated, upload.single("image"), dishImage.update);

module.exports = dishesRoutes;