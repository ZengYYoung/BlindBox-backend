const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const blindBoxRoutes = require('./routes/blindBoxRoutes');
const orderRoutes = require('./routes/orderRoutes');
const playerShowRoutes = require('./routes/playerShowRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/blindbox', blindBoxRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/playershow', playerShowRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '服务器内部错误' });
});

module.exports = app;
    