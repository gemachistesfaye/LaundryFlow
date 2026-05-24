const supabase = require('../db');

exports.getMyNotifications = async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.userId)
      .eq('is_read', false);

    if (error) throw error;
    res.json({ success: true, message: 'Notifications marked as read.' });
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
