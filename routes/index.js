const express = require('express');

const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const orderRouter = require('./orders.router');
const costumerRouter = require('./costumer.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/costumers', costumerRouter);
  router.use('/categories', categoriesRouter);
  router.use('/products', productsRouter);

}

module.exports = routerApi;
