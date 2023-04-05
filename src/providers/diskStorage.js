const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
    async deleteFile(file) {
        const avatarPath = path.resolve(uploadConfig.UPLOADS_AVATAR_FOLDER, file);
        const imagePath = path.resolve(uploadConfig.UPLOADS_IMAGE_FOLDER, file);

        if (fs.existsSync(avatarPath)) {
            await fs.promises.unlink(avatarPath);
        }

        if (fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
        }
    }
}

module.exports = DiskStorage;