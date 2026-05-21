const supabase = require('../db');

// POST /api/payments/create
exports.createPayment = async (req, res) => {
  const { order_id, amount, payment_method } = req.body;
  const student_id = req.user.userId;

  if (!order_id || !amount) {
    return res.status(400).json({ success: false, message: 'Order ID and amount are required.' });
  }

  try {
    const { error } = await supabase
      .from('payments')
      .insert([{ student_id, order_id, amount, payment_method: payment_method || 'cash', status: 'pending' }]);

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Payment submitted for confirmation.' });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating payment.' });
  }
};

// GET /api/payments/my-payments
exports.getMyPayments = async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`*, laundry_orders(tracking_code)`)
      .eq('student_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (payments || []).map(p => ({
      ...p,
      tracking_code: p.laundry_orders?.tracking_code || null
    }));

    res.json({ success: true, payments: mapped });
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/payments/all
exports.getAllPayments = async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`*, users!student_id(full_name), laundry_orders(tracking_code)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (payments || []).map(p => ({
      ...p,
      student_name: p.users?.full_name || null,
      tracking_code: p.laundry_orders?.tracking_code || null
    }));

    res.json({ success: true, payments: mapped });
  } catch (error) {
    console.error('Get All Payments Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/payments/confirm
exports.confirmPayment = async (req, res) => {
  const { payment_id, status } = req.body;

  try {
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status, confirmed_by: req.user.userId })
      .eq('id', payment_id);

    if (updateError) throw updateError;

    if (status === 'confirmed') {
      const { data: paymentRows } = await supabase
        .from('payments')
        .select('student_id, amount')
        .eq('id', payment_id)
        .single();

      if (paymentRows) {
        // Fetch current wallet balance, then increment
        const { data: userRow } = await supabase
          .from('users')
          .select('wallet_balance')
          .eq('id', paymentRows.student_id)
          .single();

        const newBalance = (userRow?.wallet_balance || 0) + paymentRows.amount;

        await supabase
          .from('users')
          .update({ wallet_balance: newBalance })
          .eq('id', paymentRows.student_id);
      }
    }

    res.json({ success: true, message: `Payment ${status}.` });
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
