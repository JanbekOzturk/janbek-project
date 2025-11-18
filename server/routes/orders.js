// routes/orders.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const router = express.Router();

/**
 * POST /api/orders
 * Create a new order.
 *
 * Body example:
 * {
 *   "name": "John Smith",
 *   "phoneNumber": "07123456789",
 *   "lessonId": "691ca7925752b23936b4f23b",
 *   "numberOfSpaces": 2
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, lessonId, numberOfSpaces } = req.body;

    if (!name || !phoneNumber || !lessonId || !numberOfSpaces) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const ordersCol = getCollection('orders');

    const orderDoc = {
      name,
      phoneNumber,
      lessonId: new ObjectId(lessonId),
      numberOfSpaces: Number(numberOfSpaces),
      createdAt: new Date()
    };

    const result = await ordersCol.insertOne(orderDoc);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId
    });
  } catch (err) {
    console.error('Error in POST /api/orders:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
