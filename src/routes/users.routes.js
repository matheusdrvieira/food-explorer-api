const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/usersController");
const UserAvatar = require("../controllers/userAvatar");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER_AVATAR);

const usersController = new UsersController();
const userAvatar = new UserAvatar();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatar.update);

module.exports = usersRoutes;