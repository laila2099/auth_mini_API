const express = require('express');
const authController = require('../controllers/auth.controller');
const { signupValidator, loginValidator, authRateLimiter } = require('../middlewares/validate');
const protect = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', authRateLimiter, signupValidator, authController.signup);
router.post('/login', authRateLimiter, loginValidator, authController.login);
router.post('/refresh', authController.refresh); 
router.post('/logout', authController.logout);
router.get('/profile', protect, authController.getProfile);

module.exports = router;