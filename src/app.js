const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const xss = require('xss-clean'); صار عندي تعارض مع ال express 5 وقفتها وحطيت .escape()
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');

const app = express();

app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser()); 
// app.use(xss()); 

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/', protectedRoutes);
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: `المسار ${req.originalUrl} غير مدعوم على هذا السيرفر.` });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB server successfully connected and ready to handle requests!');
    app.listen(PORT, () => {
      console.log(`🚀 server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ فشل الاتصال بقاعدة البيانات المحددة:', err.message);
  });