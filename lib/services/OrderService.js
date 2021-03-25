const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }


  static async getAllOrders() {
    const allOrder = await Order.selectAllOrders();

    return allOrder;
  }


  static async getOneOrder(id) {
    const oneOrder = await Order.selectOneOrder(id);

    return oneOrder;
  }


  static async updateOneOrder(quantity, id) {
    const updateOneOrder = await Order.updateOneOrder(quantity, id);

    if (updateOneOrder){
      await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Your order has been updated to ${updateOneOrder[0]["quantity"]} cookies.`
      );
    }

    return updateOneOrder;
  }


  static async deleteOneOrder(id) {
    const oneDeletedOrder = await Order.deleteOneOrder(id);

    if (oneDeletedOrder){
      await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Your order for ${oneDeletedOrder[0]["quantity"]} cookies has been cancelled.`
      );
    }

    return oneDeletedOrder;
  }


};
