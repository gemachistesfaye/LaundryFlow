const supabase = require('../db');
const crypto = require('crypto');

const generateTrackingCode = () => 'WASH-' + crypto.randomBytes(4).toString('hex').toUpperCase();

// POST /api/laundry/create
exports.createOrder = async (req, res) => {
  const { items, notes, phone, room, image_url } = req.body;
  const studentId = req.user.userId;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one item is required.' });
  }

  try {
    const trackingCode = generateTrackingCode();
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 5) * (item.quantity || 1), 0);

    // Store extra metadata as JSON in notes field
    const meta = JSON.stringify({ note: notes || '', phone: phone || '', room: room || '', image_url: image_url || '' });

    const { data: order, error: orderError } = await supabase
      .from('laundry_orders')
      .insert([{ student_id: studentId, tracking_code: trackingCode, total_price: totalPrice, item_count: items.length, notes: meta }])
      .select('id').single();

    if (orderError) throw orderError;
    const orderId = order.id;

    const clothesRows = items.map(item => ({
      order_id: orderId,
      item_name: item.name,
      quantity: item.quantity || 1,
      tracking_code: trackingCode + '-' + crypto.randomBytes(2).toString('hex').toUpperCase()
    }));

    const { error: clothesError } = await supabase.from('clothes').insert(clothesRows);
    if (clothesError) throw clothesError;

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

// GET /api/laundry/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('laundry_orders')
      .select('*')
      .eq('student_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/all-orders
exports.getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('laundry_orders')
      .select(`*, student:users!laundry_orders_student_id_fkey(full_name, phone), worker:users!laundry_orders_worker_id_fkey(full_name), clothes(item_name, quantity)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (orders || []).map(o => ({
      ...o,
      student_name: o.student?.full_name || null,
      student_phone: o.student?.phone || null,
      worker_name: o.worker?.full_name || null
    }));

    res.json({ success: true, orders: mapped });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/worker-orders
exports.getWorkerOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('laundry_orders')
      .select(`*, student:users!laundry_orders_student_id_fkey(full_name), clothes(item_name, quantity)`)
      .eq('worker_id', req.user.userId)
      .in('status', ['assigned', 'washing', 'drying', 'ready'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (orders || []).map(o => ({ ...o, student_name: o.student?.full_name || null }));
    res.json({ success: true, orders: mapped });
  } catch (error) {
    console.error('Get Worker Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/laundry/update-status
exports.updateStatus = async (req, res) => {
  const { order_id, status } = req.body;
  const validStatuses = ['washing', 'drying', 'ready'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status for worker.' });
  }

  try {
    const { data: orderData } = await supabase.from('laundry_orders')
      .update({ status })
      .eq('id', order_id)
      .select('student_id, tracking_code')
      .single();
      
    await supabase.from('clothes').update({ status }).eq('order_id', order_id);

    if (status === 'ready') {
      await supabase.from('delivery_tasks').insert([{ order_id }]);
    }
    
    if (orderData) {
      await supabase.from('notifications').insert([{
        user_id: orderData.student_id,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your order ${orderData.tracking_code} is now ${status}.`,
        type: 'order_update'
      }]);
    }

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/laundry/order/:id/items
exports.getOrderItems = async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('clothes')
      .select('*')
      .eq('order_id', req.params.id);

    if (error) throw error;
    res.json({ success: true, items });
  } catch (error) {
    console.error('Get Items Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
