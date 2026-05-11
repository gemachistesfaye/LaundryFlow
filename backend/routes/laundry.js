const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);

router.post('/create', authorize('student'), laundryController.createOrder);
router.get('/my-orders', authorize('student'), laundryController.getMyOrders);
router.get('/all-orders', authorize('admin'), laundryController.getAllOrders);
router.get('/worker-orders', authorize('worker'), laundryController.getWorkerOrders);
router.put('/update-status', authorize('worker'), laundryController.updateStatus);
router.get('/order/:id/items', laundryController.getOrderItems);

module.exports = router;
