const db = require('../db');

// POST /api/payments/create — Student creates a payment for an order
exports.createPayment = async (req, res) => {
  const { order_id, amount, payment_method } = req.body;
  const student_id = req.user.userId;

  if (!order_id || !amount) {
    return res.status(400).json({ success: false, message: 'Order ID and amount are required.' });
  }

  try {
    await db.query(
      'INSERT INTO payments (student_id, order_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
      [student_id, order_id, amount, payment_method || 'cash', 'pending']
    );
    res.status(201).json({ success: true, message: 'Payment submitted for confirmation.' });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating payment.' });
  }
};

// GET /api/payments/my-payments — Student views their payments
exports.getMyPayments = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, o.tracking_code 
       FROM payments p 
       LEFT JOIN laundry_orders o ON p.order_id = o.id 
       WHERE p.student_id = ? ORDER BY p.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/payments/all — Admin views all payments
exports.getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, u.full_name as student_name, o.tracking_code 
       FROM payments p 
       JOIN users u ON p.student_id = u.id 
       LEFT JOIN laundry_orders o ON p.order_id = o.id 
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get All Payments Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/payments/confirm — Admin confirms a payment
exports.confirmPayment = async (req, res) => {
  const { payment_id, status } = req.body; // status: 'confirmed' or 'rejected'

  try {
    await db.query(
      'UPDATE payments SET status = ?, confirmed_by = ? WHERE id = ?',
      [status, req.user.userId, payment_id]
    );

    // If confirmed, update the user's wallet balance or mark the order as paid
    if (status === 'confirmed') {
      const [payment] = await db.query('SELECT student_id, amount FROM payments WHERE id = ?', [payment_id]);
      if (payment.length > 0) {
        await db.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', 
          [payment[0].amount, payment[0].student_id]);
      }
    }

    res.json({ success: true, message: `Payment ${status}.` });
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
