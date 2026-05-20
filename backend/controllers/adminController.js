const bcrypt = require('bcryptjs');
const db = require('../db');

// POST /api/admin/create-worker
exports.createWorker = async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password_hash, 'worker', full_name, phone || '']
    );

    res.status(201).json({ success: true, message: 'Worker account created.', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Username or email already exists.' });
    }
    console.error('Create Worker Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/admin/create-deliverer
exports.createDeliverer = async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password_hash, 'deliverer', full_name, phone || '']
    );

    res.status(201).json({ success: true, message: 'Deliverer account created.', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Username or email already exists.' });
    }
    console.error('Create Deliverer Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/users — list all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, role, full_name, phone, wallet_balance, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/analytics — system analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [[{ totalStudents }]] = await db.query("SELECT COUNT(*) as totalStudents FROM users WHERE role = 'student'");
    const [[{ totalWorkers }]] = await db.query("SELECT COUNT(*) as totalWorkers FROM users WHERE role = 'worker'");
    const [[{ totalDeliverers }]] = await db.query("SELECT COUNT(*) as totalDeliverers FROM users WHERE role = 'deliverer'");
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) as totalOrders FROM laundry_orders");
    const [[{ pendingOrders }]] = await db.query("SELECT COUNT(*) as pendingOrders FROM laundry_orders WHERE status = 'submitted'");
    const [[{ completedOrders }]] = await db.query("SELECT COUNT(*) as completedOrders FROM laundry_orders WHERE status = 'delivered'");
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM payments WHERE status = 'confirmed'");

    res.json({
      success: true,
      analytics: { totalStudents, totalWorkers, totalDeliverers, totalOrders, pendingOrders, completedOrders, totalRevenue }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin/assign-worker
exports.assignWorker = async (req, res) => {
  const { order_id, worker_id } = req.body;
  try {
    await db.query("UPDATE laundry_orders SET worker_id = ?, status = 'assigned' WHERE id = ?", [worker_id, order_id]);
    res.json({ success: true, message: 'Worker assigned to order.' });
  } catch (error) {
    console.error('Assign Worker Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/admin/assign-deliverer
exports.assignDeliverer = async (req, res) => {
  const { order_id, deliverer_id } = req.body;
  try {
    // Update the delivery task with the deliverer
    const [tasks] = await db.query('SELECT id FROM delivery_tasks WHERE order_id = ? AND status = ?', [order_id, 'pending']);
    if (tasks.length === 0) {
      // Create a delivery task if one doesn't exist
      await db.query('INSERT INTO delivery_tasks (order_id, deliverer_id, status) VALUES (?, ?, ?)', [order_id, deliverer_id, 'picked_up']);
    } else {
      await db.query('UPDATE delivery_tasks SET deliverer_id = ?, status = ? WHERE id = ?', [deliverer_id, 'picked_up', tasks[0].id]);
    }

    // Update the order status to out_for_delivery
    await db.query("UPDATE laundry_orders SET status = 'out_for_delivery' WHERE id = ?", [order_id]);

    res.json({ success: true, message: 'Deliverer assigned. Order is out for delivery.' });
  } catch (error) {
    console.error('Assign Deliverer Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
