const db = require('../db');
const crypto = require('crypto');

// Generate unique tracking code
const generateTrackingCode = () => {
  return 'WASH-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// POST /api/laundry/create — Student creates order
exports.createOrder = async (req, res) => {
  const { items, notes } = req.body;
  const studentId = req.user.userId;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one item is required.' });
  }

  try {
    const trackingCode = generateTrackingCode();
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 5) * (item.quantity || 1), 0);

    const [orderResult] = await db.query(
      'INSERT INTO laundry_orders (student_id, tracking_code, total_price, item_count, notes) VALUES (?, ?, ?, ?, ?)',
      [studentId, trackingCode, totalPrice, items.length, notes || '']
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const itemCode = trackingCode + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();
      await db.query(
        'INSERT INTO clothes (order_id, item_name, quantity, tracking_code) VALUES (?, ?, ?, ?)',
        [orderId, item.name, item.quantity || 1, itemCode]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: { id: orderId, trackingCode, totalPrice, itemCount: items.length }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating order.' });
  }
};

// GET /api/laundry/my-orders — Student views own orders
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM laundry_orders WHERE student_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/all-orders — Admin views all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.full_name as student_name, w.full_name as worker_name
       FROM laundry_orders o
       LEFT JOIN users u ON o.student_id = u.id
       LEFT JOIN users w ON o.worker_id = w.id
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/worker-orders — Worker views assigned orders
exports.getWorkerOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.full_name as student_name
       FROM laundry_orders o
       LEFT JOIN users u ON o.student_id = u.id
       WHERE o.worker_id = ? AND o.status IN ('assigned', 'washing', 'drying', 'ready')
       ORDER BY o.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get Worker Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/laundry/update-status — Worker updates order status
exports.updateStatus = async (req, res) => {
  const { order_id, status } = req.body;
  const validStatuses = ['washing', 'drying', 'ready'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status for worker.' });
  }

  try {
    await db.query('UPDATE laundry_orders SET status = ? WHERE id = ?', [status, order_id]);
    await db.query('UPDATE clothes SET status = ? WHERE order_id = ?', [status, order_id]);

    // If status is "ready", create a delivery task
    if (status === 'ready') {
      await db.query('INSERT INTO delivery_tasks (order_id) VALUES (?)', [order_id]);
    }

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/order/:id/items — Get items in an order
exports.getOrderItems = async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM clothes WHERE order_id = ?', [req.params.id]);
    res.json({ success: true, items });
  } catch (error) {
    console.error('Get Items Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
