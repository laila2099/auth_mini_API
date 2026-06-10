const express = require('express');
const protectedController = require('../controllers/protected.controller');
const protect = require('../middlewares/auth');
const restrictTo = require('../middlewares/role');
const { deleteUserValidator } = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

router.get('/me/welcome', protectedController.getWelcome);
router.get('/me/account-summary', protectedController.getAccountSummary);
router.get('/admin/overview', restrictTo('admin'), protectedController.getAdminOverview);
router.get('/admin/users', restrictTo('admin'), protectedController.getAdminUsers);
router.delete('/admin/users/:id', restrictTo('admin'), deleteUserValidator, protectedController.deleteAdminUser);

module.exports = router;