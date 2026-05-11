const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);

// General chat endpoint for all roles
router.post('/chat', aiController.chatWithAI);

// Admin specific AI insights
router.get('/insights', authorize('admin'), aiController.getAdminAnalytics);

module.exports = router;
