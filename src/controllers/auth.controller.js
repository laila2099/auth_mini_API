const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const signTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
  return { accessToken, refreshToken };
};

const sendCookies = (res, tokens) => {
  const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict'
  };

  res.cookie('accessToken', tokens.accessToken, { 
    ...cookieOptions, 
    maxAge: 15 * 60 * 1000 
  });
  
  res.cookie('refreshToken', tokens.refreshToken, { 
    ...cookieOptions, 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    const newUser = await User.create({ name, email, password, role });

    newUser.password = undefined;

    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const tokens = signTokens(user._id, user.role);

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    sendCookies(res, tokens);

    user.password = undefined;
    user.refreshToken = undefined;

    res.status(200).json({ status: 'success', message: 'تم تسجيل الدخول بنجاح', data: { user } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ status: 'fail', message: 'لم يتم العثور على ريفريش توكن' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ status: 'fail', message: 'الريفريش توكن غير صالح أو تم استخدامه مسبقاً' });
    }

    const tokens = signTokens(user._id, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    sendCookies(res, tokens);

    res.status(200).json({ status: 'success', message: 'تم تجديد توكن الوصول بنجاح' });
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول' });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { $unset: { refreshToken: 1 } });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ status: 'success', message: 'تم تسجيل الخروج وتطهير الجلسة بنجاح' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
};