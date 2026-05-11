const db = require('../db');

// GET /api/delivery/tasks — Deliverer views pending delivery tasks
exports.getMyTasks = async (req, res) => {
  try {
    const [tasks] = await db.query(
      `SELECT dt.*, o.tracking_code, o.total_price, o.item_count, u.full_name as student_name, u.phone as student_phone
       FROM delivery_tasks dt
       JOIN laundry_orders o ON dt.order_id = o.id
       JOIN users u ON o.student_id = u.id
       WHERE (dt.deliverer_id = ? OR dt.deliverer_id IS NULL) AND dt.status != 'delivered'
       ORDER BY dt.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Get Delivery Tasks Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/delivery/accept — Deliverer accepts a task
exports.acceptTask = async (req, res) => {
  const { task_id } = req.body;
  try {
    await db.query('UPDATE delivery_tasks SET deliverer_id = ?, status = ? WHERE id = ?',
      [req.user.userId, 'picked_up', task_id]);
    res.json({ success: true, message: 'Task accepted.' });
  } catch (error) {
    console.error('Accept Task Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/delivery/complete — Deliverer marks delivery as complete
exports.completeDelivery = async (req, res) => {
  const { task_id } = req.body;
  try {
    // Update delivery task
    await db.query('UPDATE delivery_tasks SET status = ?, delivered_at = NOW() WHERE id = ?',
      ['delivered', task_id]);

    // Get the order_id from the task
    const [tasks] = await db.query('SELECT order_id FROM delivery_tasks WHERE id = ?', [task_id]);
    if (tasks.length > 0) {
      const orderId = tasks[0].order_id;
      // Update laundry order status to delivered
      await db.query("UPDATE laundry_orders SET status = 'delivered' WHERE id = ?", [orderId]);
      await db.query("UPDATE clothes SET status = 'delivered' WHERE order_id = ?", [orderId]);
    }

    res.json({ success: true, message: 'Delivery completed.' });
  } catch (error) {
    console.error('Complete Delivery Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
