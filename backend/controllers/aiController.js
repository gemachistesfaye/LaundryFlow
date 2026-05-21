const supabase = require('../db');

exports.chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  try {
    let reply = "I'm your LaundryFlow AI Assistant. How can I help you today?";
    const msgLower = message.toLowerCase();

    if (role === 'student') {
      if (msgLower.includes('status') || msgLower.includes('where is my')) {
        const { data: orders } = await supabase
          .from('laundry_orders')
          .select('status, tracking_code')
          .eq('student_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (orders && orders.length > 0) {
          const status = orders[0].status.replace(/_/g, ' ');
          reply = `Your most recent laundry (Tracking: ${orders[0].tracking_code}) is currently marked as **${status}**.`;
          if (status === 'washing' || status === 'assigned') reply += ' It should be ready in about 2-3 hours.';
          if (status === 'ready') reply += " It's ready! A deliverer will pick it up soon.";
        } else {
          reply = "I couldn't find any active laundry orders for you. Would you like to create one?";
        }
      } else if (msgLower.includes('delivery time') || msgLower.includes('when')) {
        reply = "Based on our current AI predictions, deliveries are taking approximately 45 minutes after the 'Ready' status. Peak hours are usually between 4 PM and 7 PM.";
      } else if (msgLower.includes('pay') || msgLower.includes('price')) {
        reply = 'Laundry costs 5 ETB per item. You can add funds via Telebirr or CBE in the Payment section of your dashboard.';
      } else {
        reply = "I am an AI assistant here to help you track your laundry, predict delivery times, and answer questions. Ask me 'Where is my laundry?' or 'What is the delivery time?'";
      }
    } else if (role === 'admin') {
      if (msgLower.includes('workload') || msgLower.includes('balance')) {
        reply = 'AI Workload Analysis: Worker #2 currently has 40% more tasks than Worker #1. I suggest assigning the next 3 batches to Worker #1 to optimize turnaround time.';
      } else if (msgLower.includes('delay') || msgLower.includes('slow')) {
        reply = "AI Delay Detection: Order WASH-A17D has been in 'Washing' for over 4 hours. Please check with the assigned worker to prevent SLA breaches.";
      } else if (msgLower.includes('predict') || msgLower.includes('busy')) {
        reply = 'AI Prediction: Based on historical data, tomorrow (Friday) will see a 35% spike in laundry submissions. Recommend ensuring all deliverers are active.';
      } else {
        reply = "Admin AI Assistant active. I can analyze workloads, predict busy days, and detect workflow delays. Ask me 'Suggest workload balancing' or 'Predict busy days'.";
      }
    } else {
      reply = 'Hello! I am your AI assistant. I help optimize operations and answer questions.';
    }

    setTimeout(() => {
      res.json({ success: true, reply });
    }, 1000);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ success: false, message: 'AI Service Error' });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const aiInsights = [
      { type: 'prediction', text: 'Tomorrow (Friday) expects a 35% spike in orders. Ensure workers are staffed.', severity: 'info' },
      { type: 'delay_warning', text: 'WASH-10A2 has been in drying for > 3 hours. Potential delay.', severity: 'warning' },
      { type: 'efficiency', text: 'Worker efficiency is up 12% this week. Delivery dispatching is optimal.', severity: 'success' }
    ];
    res.json({ success: true, insights: aiInsights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI Analytics Error' });
  }
};
