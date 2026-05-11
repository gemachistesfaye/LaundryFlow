const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);

// Student routes
router.post('/create', authorize('student'), paymentController.createPayment);
router.get('/my-payments', authorize('student'), paymentController.getMyPayments);

// Admin routes
router.get('/all', authorize('admin'), paymentController.getAllPayments);
router.put('/confirm', authorize('admin'), paymentController.confirmPayment);

module.exports = router;
