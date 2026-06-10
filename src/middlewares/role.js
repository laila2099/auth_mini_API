const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'عذراً! لا تمتلك الصلاحيات الكافية للوصول إلى هذا الإجراء' 
      });
    }
    next();
  };
};

module.exports = restrictTo;