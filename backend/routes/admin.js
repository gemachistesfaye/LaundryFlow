const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(verifyToken, authorize('admin'));

router.post('/create-worker', adminController.createWorker);
router.post('/create-deliverer', adminController.createDeliverer);
router.get('/users', adminController.getAllUsers);
router.get('/analytics', adminController.getAnalytics);
router.put('/assign-worker', adminController.assignWorker);
router.put('/assign-deliverer', adminController.assignDeliverer);
router.put('/request-payment', adminController.requestPayment);
router.put('/cancel-order', adminController.cancelOrder);
router.delete('/remove-user/:id', adminController.removeUser);

module.exports = router;
