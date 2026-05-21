const bcrypt = require('bcryptjs');
const supabase = require('../db');

// POST /api/admin/create-worker
exports.createWorker = async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash, role: 'worker', full_name, phone: phone || '' }])
      .select('id').single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ success: false, message: 'Username or email already exists.' });
      throw error;
    }
    res.status(201).json({ success: true, message: 'Worker account created.', userId: data.id });
  } catch (error) {
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

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash, role: 'deliverer', full_name, phone: phone || '' }])
      .select('id').single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ success: false, message: 'Username or email already exists.' });
      throw error;
    }
    res.status(201).json({ success: true, message: 'Deliverer account created.', userId: data.id });
  } catch (error) {
    console.error('Create Deliverer Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, role, full_name, phone, wallet_balance, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const countByRole = async (role) => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', role);
      return count || 0;
    };
    const countOrders = async (status) => {
      const q = supabase.from('laundry_orders').select('*', { count: 'exact', head: true });
      if (status) q.eq('status', status);
      const { count } = await q;
      return count || 0;
    };

    const [totalStudents, totalWorkers, totalDeliverers, totalOrders, pendingOrders, completedOrders] = await Promise.all([
      countByRole('student'), countByRole('worker'), countByRole('deliverer'),
      countOrders(null), countOrders('submitted'), countOrders('delivered')
    ]);

    const { data: revenueData } = await supabase.from('payments').select('amount').eq('status', 'confirmed');
    const totalRevenue = revenueData ? revenueData.reduce((sum, p) => sum + (p.amount || 0), 0) : 0;

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
    const { error } = await supabase
      .from('laundry_orders')
      .update({ worker_id, status: 'assigned' })
      .eq('id', order_id);

    if (error) throw error;
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
    const { data: tasks } = await supabase
      .from('delivery_tasks')
      .select('id')
      .eq('order_id', order_id)
      .eq('status', 'pending')
      .limit(1);

    if (!tasks || tasks.length === 0) {
      await supabase.from('delivery_tasks').insert([{ order_id, deliverer_id, status: 'picked_up' }]);
    } else {
      await supabase.from('delivery_tasks').update({ deliverer_id, status: 'picked_up' }).eq('id', tasks[0].id);
    }

    await supabase.from('laundry_orders').update({ status: 'out_for_delivery' }).eq('id', order_id);

    res.json({ success: true, message: 'Deliverer assigned. Order is out for delivery.' });
  } catch (error) {
    console.error('Assign Deliverer Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
