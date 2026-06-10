const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

const signupValidator = [
  body('name').trim().notEmpty().withMessage('الاسم مطلوب ولا يمكن تركه فارغاً').escape(),
  body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح مسبوق بـ @').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('يجب ألا تقل كلمة المرور عن 6 خانات'),
  body('role').optional().isIn(['user', 'admin']).withMessage('الرتبة المتاحة هي user أو admin فقط'),
  validateResults
];

const loginValidator = [
  body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح').normalizeEmail(),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة لاستكمال العملية'),
  validateResults
];

const deleteUserValidator = [
  param('id').isMongoId().withMessage('معرّف المستخدم (ID) غير صالح في نظام Mongo'),
  validateResults
];

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { status: 'fail', message: 'تجاوزت الحد المسموح من المحاولات. يرجى الانتظار 15 دقيقة.' }
});

module.exports = {
  signupValidator,
  loginValidator,
  deleteUserValidator,
  authRateLimiter
};