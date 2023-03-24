const PaymentMethod = require("../../enum/paymentMethod");
const OrderStatus = require("../../enum/orderStatus");

class OrderRepository {
    async create({ user_id, dishes, amount, payment }) {
        try {
            const [order_id] = await knex("ORDER").insert({
                user_id: user_id,
                amount: amount,
                payment: payment,
                status: OrderStatus.PENDING
            });

            for (const dish of dishes) {
                await knex("ORDER_DISH").insert({
                    order_id: order_id,
                    dish_id: dish.id,
                    quantity: dish.quantity
                });
            }

            return [order_id];
        } catch (error) {

            return response.json(error)
        }
    }
}

module.exports = OrderRepository