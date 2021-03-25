const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order.js');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 11 })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 11,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 11 });

    expect(res.body).toEqual({
      id: '1',
      quantity: 11,
    });
  });

  it('returns all values in the DB', async () => {
    const insertOne = await Order.insert({ quantity: 5 })
    const insertTwo = await Order.insert({ quantity: 15 })
    const insertThree = await Order.insert({ quantity: 25 })

    const res = await request(app)
      .get('/api/v1/orders')

    expect(res.body).toEqual([insertOne, insertTwo, insertThree])

  });

  it('returns one value in the DB', async () => {
    const insertOne = await Order.insert({ quantity: 5 })
    const insertTwo = await Order.insert({ quantity: 15 })
    const insertThree = await Order.insert({ quantity: 25 })

    const res = await request(app)
      .get('/api/v1/orders/2')

    expect(res.body).toEqual([insertTwo])

  });

  it('Will update one row in the database', async () => {
    const insertOne = await Order.insert({ quantity: 5 })
    const insertTwo = await Order.insert({ quantity: 15 })

    const res = await request(app)
      .put('/api/v1/orders/2')
      .send({quantity: 99})

    const updatedOrder = await request(app)
      .get('/api/v1/orders/2')

    expect(res.body).toEqual(updatedOrder.body)

  });

  it('Deletes a row and returns remaining?', async () => {
    const insertOne = await Order.insert({ quantity: 5 })
    const insertTwo = await Order.insert({ quantity: 15 })
    const insertThree = await Order.insert({ quantity: 25 })

    const res = await request(app)
      .delete('/api/v1/orders/2')

    const allOrders = await request(app)
      .get('/api/v1/orders')

    expect(res.body).toEqual([insertTwo])
    expect(allOrders.body.length).toEqual(2)

  });
});
