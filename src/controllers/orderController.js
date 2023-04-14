const knex = require("../database/knex");
const PaymentMethod = require("../enum/paymentMethod");
const OrderStatus = require("../enum/orderStatus");
const AppError = require("../utils/AppError");

class OrderController {
    async create(request, response) {
        const userId = request.user.id;
        const { dishes } = request.body;

        try {
            await knex.transaction(async (trx) => {
                const [order_id] = await trx("ORDER").insert({
                    user_id: userId,
                    amount: 0,
                    payment: null,
                    status: OrderStatus.PENDING
                });

                for (const dish of dishes) {
                    await trx("ORDER_DISH").insert({
                        order_id,
                        dish_id: dish.id,
                        quantity: dish.quantity
                    });
                }

                const orders = await trx("ORDER")
                    .select(['ORDER.id', 'ORDER.user_id', 'ORDER.amount'])
                    .where({ user_id: userId })


                let orderlist = [];

                await Promise.all(orders.map(async order => {
                    const orderDishesQuery = await trx("ORDER_DISH")
                        .select(['DISH.price', 'ORDER_DISH.quantity'])
                        .innerJoin("DISH", "DISH.id", "ORDER_DISH.dish_id")
                        .where({ order_id: order.id })

                    orderlist.push(...orderDishesQuery);
                }))

                let total = 0;

                for (const dish of orderlist) {
                    total += dish.price * dish.quantity;
                }

                await trx("ORDER").where({ id: order_id }).update({
                    amount: total,
                });
            });

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

            return response.json(orders);
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

    async updateOrder(request, response) {
        try {
            const orderId = request.params.id;
            const { dishes, payment } = request.body;

            for (const dish of dishes) {
                const orderDish = await knex("ORDER_DISH")
                    .where({
                        order_id: orderId,
                        dish_id: dish.id
                    }).first();

                await knex("ORDER_DISH")
                    .where({
                        order_id: orderId,
                        dish_id: dish.id
                    })
                    .update({
                        quantity:
                            Number(dish.quantity) ? Number(dish.quantity) + Number(orderDish.quantity) : Number(orderDish.quantity)
                    });
            };

            const orderDishes = await knex("ORDER_DISH")
                .select(['DISH.price', 'ORDER_DISH.quantity'])
                .innerJoin("DISH", "DISH.id", "ORDER_DISH.dish_id")
                .where({ order_id: orderId })

            let total = 0;

            for (const orderDish of orderDishes) {
                total += orderDish.price * orderDish.quantity;
            }

            if (payment == undefined) {

                await knex("ORDER").where({ id: orderId }).update({
                    amount: total,
                    payment: null
                });

            } else {
                if (!Object.values(PaymentMethod).includes(payment)) {
                    return response.status(400).json({ message: "Método de pagamento inválido" });
                }

                await knex("ORDER").where({ id: orderId }).update({
                    payment: payment
                });
            }
            return response.status(200).json({ message: "Pedido atualizado com sucesso." });

        } catch (error) {
            throw new AppError(error.message, 500);
        }
    }
}

module.exports = OrderController;