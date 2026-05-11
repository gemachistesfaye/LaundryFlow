const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @route   POST /api/orders/create
 * @desc    Create a new laundry order
 */
router.post('/create', async (req, res) => {
  const { student_id, items, total_price } = req.body;

  if (!student_id || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid order data" });
  }

  try {
    // Generate tracking code
    const trackingCode = 'WASH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create order
    const [orderResult] = await db.query(
      "INSERT INTO laundry_orders (student_id, total_price, item_count, tracking_code, status) VALUES (?, ?, ?, ?, 'pending_approval')",
      [student_id, total_price, items.length, trackingCode]
    );

    const orderId = orderResult.insertId;

    // Create individual clothing items
    for (const item of items) {
      await db.query(
        "INSERT INTO clothes (order_id, student_id, item_name, status, tracking_code) VALUES (?, ?, ?, 'submitted', ?)",
        [orderId, student_id, item.name, trackingCode + '-' + Math.random().toString(36).substring(2, 5).toUpperCase()]
      );
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
      trackingCode
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Server error during order creation" });
  }
});

/**
 * @route   GET /api/orders/my-orders/:userId
 * @desc    Get orders for a specific student
 */
router.get('/my-orders/:userId', async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM laundry_orders WHERE student_id = ? ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
});

/**
 * @route   POST /api/orders/update-status
 * @desc    Update status of an order (Worker/Admin only)
 */
router.post('/update-status', async (req, res) => {
  const { order_id, status, worker_id } = req.body;

  try {
    await db.query(
      "UPDATE laundry_orders SET status = ?, worker_id = ? WHERE id = ?",
      [status, worker_id, order_id]
    );

    // Update status for all clothes in this order
    await db.query("UPDATE clothes SET status = ? WHERE order_id = ?", [status, order_id]);

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Server error updating status" });
  }
});

module.exports = router;
