const supabase = require('../db');

// POST /api/payments/create
exports.createPayment = async (req, res) => {
  const { order_id, amount, payment_method } = req.body;
  const student_id = req.user.userId;

  if (!order_id || !amount) {
    return res.status(400).json({ success: false, message: 'Order ID and amount are required.' });
  }

  try {
    // Check if there is already a pending payment for this order
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('order_id', order_id)
      .eq('status', 'pending')
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing pending payment
      const { error } = await supabase
        .from('payments')
        .update({ amount, payment_method: payment_method || 'cash' })
        .eq('id', existing[0].id);
      if (error) throw error;
    } else {
      // Insert new payment
      const { error } = await supabase
        .from('payments')
        .insert([{ student_id, order_id, amount, payment_method: payment_method || 'cash', status: 'pending' }]);
      if (error) throw error;
    }

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


// POST /api/payments/chapa-checkout
exports.initializeChapaCheckout = async (req, res) => {
  const { order_id, amount } = req.body;
  const student_id = req.user.userId;

  if (!order_id || !amount) {
    return res.status(400).json({ success: false, message: 'Order ID and amount are required.' });
  }

  try {
    const { data: student } = await supabase.from('users').select('email, full_name').eq('id', student_id).single();
    let email = student?.email || `student_${student_id}@smartwash.local`;
    let firstName = student?.full_name ? student.full_name.split(' ')[0] : 'Student';
    let lastName = student?.full_name ? student.full_name.split(' ')[1] || 'Lastname' : 'Lastname';

    let payment_id;
    const { data: existing } = await supabase.from('payments').select('id').eq('order_id', order_id).eq('status', 'pending').limit(1);

    if (existing && existing.length > 0) {
      payment_id = existing[0].id;
      await supabase.from('payments').update({ amount, payment_method: 'chapa' }).eq('id', payment_id);
    } else {
      const { data: newPayment } = await supabase.from('payments').insert([{ student_id, order_id, amount, payment_method: 'chapa', status: 'pending' }]).select('id').single();
      payment_id = newPayment.id;
    }

    const tx_ref = `WASH-${payment_id}-${Date.now()}`;
    const return_url = `http://localhost:5173/student/dashboard?verify_tx=${tx_ref}`;

    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'ETB',
        email: email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: tx_ref,
        callback_url: return_url,
        return_url: return_url,
        customization: { title: 'Smart Wash Hub Payment', description: 'Payment for Laundry Order' }
      })
    });

    const chapaData = await response.json();
    if (chapaData.status !== 'success') throw new Error(chapaData.message || 'Chapa init failed');

    res.json({ success: true, checkout_url: chapaData.data.checkout_url });
  } catch (error) {
    console.error('Chapa Checkout Error:', error);
    res.status(500).json({ success: false, message: 'Server error initializing Chapa.' });
  }
};

// POST /api/payments/chapa-verify
exports.verifyChapaPayment = async (req, res) => {
  const { tx_ref } = req.body;
  if (!tx_ref) return res.status(400).json({ success: false, message: 'tx_ref required.' });

  try {
    const parts = tx_ref.split('-');
    if (parts.length < 3) return res.status(400).json({ success: false, message: 'Invalid tx_ref format.' });
    const payment_id = parseInt(parts[1], 10);

    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });

    const chapaData = await response.json();

    if (chapaData.status === 'success' && chapaData.data.status === 'success') {
      await supabase.from('payments').update({ status: 'confirmed' }).eq('id', payment_id);
      
      const { data: pData } = await supabase.from('payments').select('order_id').eq('id', payment_id).single();
      if (pData) {
        await supabase.from('laundry_orders').update({ status: 'payment_pending' }).eq('id', pData.order_id); // Just to notify admin if needed, or leave it ready.
      }
      res.json({ success: true, message: 'Payment verified and confirmed successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed at Chapa.' });
    }
  } catch (error) {
    console.error('Chapa Verify Error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment.' });
  }
};

