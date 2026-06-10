const User = require('../models/user.model');

exports.getWelcome = (req, res) => {
  res.status(200).json({ status: 'success', message: `مرحباً بك مجدداً يا ${req.user.name}! أنت الآن في المسار العام المؤمن.` });
};

exports.getAccountSummary = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { accountType: req.user.role, balance: "$9,450.00", status: "Active", academicNotice: "Fake Summary Data for review" }
  });
};

exports.getAdminOverview = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { totalSystemServers: 2, databaseStatus: "Healthy", integrityCheck: "Passed" }
  });
};

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ status: 'fail', message: 'لا يمكن للأدمن تدمير أو حذف حسابه الحالي بنفسه.' });
    }

    const userToDelete = await User.findByIdAndDelete(targetId);
    if (!userToDelete) {
      return res.status(404).json({ status: 'fail', message: 'لم يتم العثور على مستخدم بهذا المعرف.' });
    }

    res.status(200).json({ status: 'success', message: 'تم إقصاء وحذف المستخدم من النظام بنجاح.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};