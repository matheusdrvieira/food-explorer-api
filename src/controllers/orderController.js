const knex = require("../database/knex");

const PaymentMethod = require("../enum/paymentMethod");
const OrderStatus = require("../enum/orderStatus");

class OrderController {
    async create(request, response) {
        try {
            const user_id = request.user.id;

            const { dishes, amount, payment, status } = request.body;

            if (!Object.values(PaymentMethod).includes(payment)) {

                return response.status(400).json({ message: "Método de pagamento inválido" });
            }

            if (!Object.values(OrderStatus).includes(status)) {

                return response.status(400).json({ message: "Status de pedido inválido" });
            }

            const [order_id] = await knex("ORDER").insert({ user_id: user_id, amount, payment, status });

            for (const dish of dishes) {
                await knex("ORDER_DISH").insert({
                    order_id,
                    dish_id: dish.id,
                    quantity: dish.quantity
                });
            }

            return response.json({ message: "Pedido criado com sucesso!" });
        } catch (error) {
            console.error(error);

            return response.status(500).json({ message: "Erro ao criar o pedido" });
        }
    }

    async delete(request, response) {
        const order_id = request.params.id;

        try {
            await knex("ORDER_DISH").where({ order_id }).delete();

            await knex("ORDER").where({ id: order_id }).delete();

            return response.json({ message: "Pedido excluído com sucesso!" });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro ao excluir o pedido" });
        }
    }
}

module.exports = OrderController;

