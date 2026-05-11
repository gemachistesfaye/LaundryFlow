const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('deliverer'));

router.get('/tasks', deliveryController.getMyTasks);
router.put('/accept', deliveryController.acceptTask);
router.put('/complete', deliveryController.completeDelivery);

module.exports = router;
