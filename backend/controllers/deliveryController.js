const supabase = require('../db');

// GET /api/delivery/tasks
exports.getMyTasks = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from('delivery_tasks')
      .select(`
        *,
        laundry_orders(tracking_code, total_price, item_count,
          users!laundry_orders_student_id_fkey(full_name, phone)
        )
      `)
      .or(`deliverer_id.eq.${req.user.userId},deliverer_id.is.null`)
      .neq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (tasks || []).map(t => ({
      ...t,
      tracking_code: t.laundry_orders?.tracking_code,
      total_price: t.laundry_orders?.total_price,
      item_count: t.laundry_orders?.item_count,
      student_name: t.laundry_orders?.users?.full_name,
      student_phone: t.laundry_orders?.users?.phone
    }));

    res.json({ success: true, tasks: mapped });
  } catch (error) {
    console.error('Get Delivery Tasks Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/delivery/accept
exports.acceptTask = async (req, res) => {
  const { task_id } = req.body;
  try {
    const { error } = await supabase
      .from('delivery_tasks')
      .update({ deliverer_id: req.user.userId, status: 'picked_up' })
      .eq('id', task_id);

    if (error) throw error;
    res.json({ success: true, message: 'Task accepted.' });
  } catch (error) {
    console.error('Accept Task Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/delivery/complete
exports.completeDelivery = async (req, res) => {
  const { task_id } = req.body;
  try {
    const { error: taskError } = await supabase
      .from('delivery_tasks')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', task_id);

    if (taskError) throw taskError;

    const { data: taskData } = await supabase
      .from('delivery_tasks')
      .select('order_id')
      .eq('id', task_id)
      .single();

    if (taskData) {
      await supabase.from('laundry_orders').update({ status: 'delivered' }).eq('id', taskData.order_id);
      await supabase.from('clothes').update({ status: 'delivered' }).eq('order_id', taskData.order_id);
    }

    res.json({ success: true, message: 'Delivery completed.' });
  } catch (error) {
    console.error('Complete Delivery Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
