const { Router } = require('express');
const OrderService = require('../services/OrderService');
const Order = require('../models/Order.js');


module.exports = Router()
  .post('/', async (req, res, next) => {
    // OrderService
    //   .create(req.body)
    //   .then(order => res.send(order))
    //   .catch(next);
    try {
      const order = await OrderService.create(req.body);
      res.send(order);
    } catch (err) {
      next(err);
    }
  })

  .get('/', async (req, res, next) => {

    try {
      const allOrdersCalled = await OrderService.getAllOrders();
      res.send(allOrdersCalled);
    } catch (err) {
      next(err);
    }

  })

  .get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
      const singleOrder = await OrderService.getOneOrder(id);
      res.send(singleOrder);
    } catch (err) {
      next(err);
    }
  })

  .put('/:id', async (req, res, next) => {
    const { id } = req.params
    const { quantity } = req.body

    try {
      const updatedOrder = await OrderService.updateOneOrder(quantity, id);
      res.send(updatedOrder);
    } catch (err) {
      next(err);
    }
  })


  .delete('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
      const deletedOrder = await OrderService.deleteOneOrder(id);
      res.send(deletedOrder);
    } catch (err) {
      next(err);
    }
  });
