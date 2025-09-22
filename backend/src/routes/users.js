const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth(), userController.getProfile);
router.get('/', auth(['admin','hr', 'manager']), userController.getEmployeeDetails);
router.post('/leave-balance', auth(['admin', 'manager']), userController.updateLeaveBalance);

module.exports = router;
