const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'المستخدم صاحب هذا التوكن لم يعد موجوداً' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'التوكن غير صالح أو منتهي الصلاحية' });
  }
};

module.exports = protect;