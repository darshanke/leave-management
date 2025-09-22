const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const leaveController = require('../controllers/leaveController');

// employee apply
router.post('/', auth(['employee','admin','hr','manager']), leaveController.applyLeave);
router.get('/me', auth(['employee','admin','hr','manager']), leaveController.getMyLeaves);

// admin routes
router.get('/pending', auth(['admin','hr','manager']), leaveController.getPendingLeaves);
router.post('/:leaveId/action', auth(['admin','hr','manager']), leaveController.handleAction);

module.exports = router;
