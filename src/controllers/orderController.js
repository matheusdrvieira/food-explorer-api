const knex = require("../database/knex");
const PaymentMethod = require("../enum/paymentMethod");
const OrderStatus = require("../enum/orderStatus");
const AppError = require("../utils/AppError");

class OrderController {
    async create(request, response) {
        const userId = request.user.id;
        const { dishes, payment } = request.body;

        try {
            if (!Object.values(PaymentMethod).includes(payment)) {

                return response.status(400).json({ message: "Método de pagamento inválido" });
            }

            const orders = await knex("ORDER")
                .select(['ORDER.id', 'ORDER.user_id', 'ORDER.amount'])
                .where({ user_id: userId })

            await Promise.all(orders.map(async order => {

                const orderlist = await knex("ORDER_DISH")
                    .select(['DISH.price', 'ORDER_DISH.quantity'])
                    .innerJoin("DISH", "DISH.id", "ORDER_DISH.dish_id")
                    .where({ order_id: order.id })

                const total = orderlist.reduce((acc, dish) => acc + dish.price * dish.quantity, 0)

                const [order_id] = await knex("ORDER").insert({
                    user_id: userId,
                    amount: total,
                    payment,
                    status: OrderStatus.PENDING
                });

                for (const dish of dishes) {
                    await knex("ORDER_DISH").insert({
                        order_id,
                        dish_id: dish.id,
                        quantity: dish.quantity
                    });
                }
            }))

            return response.json({ message: "Pedido criado com sucesso!" });
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }

    async index(request, response) {
        const userId = request.user.id;

        try {
            const orders = await knex("ORDER").where({ user_id: userId })

            await Promise.all(orders.map(async order => {
                const dishes = await knex("ORDER_DISH as OD")
                    .select("D.name", "OD.quantity", "D.price")
                    .innerJoin("DISH as D", "D.id", "OD.dish_id")
                    .where({ order_id: order.id })

                order.dishes = dishes;
            }));

            return response.json({ orders });
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }

    async updateStatus(request, response) {
        const orderId = request.params.id;
        const { status } = request.body;

        try {
            if (!Object.values(OrderStatus).includes(status)) {

                return response.status(400).json({ message: "Status do pedido inválido" });
            }

            await knex("ORDER").update({ status, updated_at: knex.fn.now() }).where({ id: orderId })

            return response.status(200).json({ message: "Status atualizado com sucesso" })
        } catch (error) {

            throw new AppError(error.message, 500);
        }
    }
}

module.exports = OrderController;