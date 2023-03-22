const knex = require("../database/knex");

const PaymentMethod = require("../enum/paymentMethod");
const OrderStatus = require("../enum/orderStatus");

class OrderController {
    async create(request, response) {
        try {
            const user_id = request.user.id;

            const { dishes, amount, payment } = request.body;

            if (!Object.values(PaymentMethod).includes(payment)) {

                return response.status(400).json({ message: "Método de pagamento inválido" });
            }

            const [order_id] = await knex("ORDER").insert({ user_id: user_id, amount, payment, status: OrderStatus.PENDING });

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

    async index(request, response) {
        const userId = request.user.id;

        const orders = await knex("ORDER").where({ user_id: userId })

        await Promise.all(orders.map(async order => {
            const dishes = await knex("ORDER_DISH as OD")
                .select("D.name", "OD.quantity")
                .innerJoin("DISH as D", "D.id", "OD.dish_id")
                .where({ order_id: order.id })

            order.dishes = dishes;
        }));

        return response.json({ orders });
    }

    async updateStatus(request, response) {
        const order_id = request.params.id;
        const { status } = request.body;

        if (!Object.values(OrderStatus).includes(status)) {

            return response.status(400).json({ message: "Status do pedido inválido" });
        }

        await knex("ORDER").update({ status }).where({ id: order_id })

        return response.status(200).json({ message: "Status atualizado com sucesso" })
    }

}

module.exports = OrderController;