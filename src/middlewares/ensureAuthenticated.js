const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(shouldIsAdmin) {

    return function (request, response, next) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new AppError("JWT Token uninformed", 401);
        }

        const [, token] = authHeader.split(" ");

        try {
            const { user_id, is_admin } = verify(token, authConfig.jwt.secret);

            if (shouldIsAdmin && !Boolean(is_admin)) {
                return response.status(403).json({ message: "Voce nao tem permissao para acessar esse recurso" })
            }

            request.user = {
                id: Number(user_id)
            }

            return next();
        } catch {
            throw new AppError("JWT Token invalid", 401);
        }
    }
}
module.exports = ensureAuthenticated;