const knex = require("../database/knex");

class OrderController {
    async create(request, response) {
        const user_id = request.user.id;
    }
}

module.exports = OrderController;
