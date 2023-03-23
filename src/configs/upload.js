const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_AVATAR_FOLDER = path.resolve(TMP_FOLDER, "uploadsAvatar");
const UPLOADS_IMAGE_FOLDER = path.resolve(TMP_FOLDER, "uploadsDish");

const MULTER_AVATAR = {
    storage: multer.diskStorage({
        destination: UPLOADS_AVATAR_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};

const MULTER_IMAGE = {
    storage: multer.diskStorage({
        destination: UPLOADS_IMAGE_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};

module.exports = {
    TMP_FOLDER,
    UPLOADS_AVATAR_FOLDER,
    UPLOADS_IMAGE_FOLDER,
    MULTER_AVATAR,
    MULTER_IMAGE
}