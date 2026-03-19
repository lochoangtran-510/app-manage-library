require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, db } = require('./models');
const { logger } = require('./middlewares/logger');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const readerRoutes = require('./routes/reader.routes');
const categoryRoutes = require('./routes/category.routes');
const bookRoutes = require('./routes/books.routes');
const borrowRoutes = require('./routes/borrow.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Library Management API!' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/readers', readerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/reports', reportRoutes);

// Start Server
const startServer = async () => {
  try {
    // Kết nối Database
    await connectDB();
    
    // Sync models
    await db.sequelize.sync({ alter: true });
    console.log('✅ All tables synchronized in PostgreSQL.');

    // Tự động tạo dữ liệu mồi (Seed) nếu database trống
    const { User } = db.models;
    const userCount = await User.count();
    if (userCount === 0) {
      const bcrypt = require('bcryptjs');
      const adminPass = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', fullName: 'Super Admin', email: 'admin@library.com', password: adminPass, role: 'ADMIN' });
      
      const libPass = await bcrypt.hash('lib123456', 10);
      await User.create({ username: 'librarian01', fullName: 'Thủ thư Mẫu', email: 'lib@library.com', password: libPass, role: 'LIBRARIAN' });
      console.log('🌱 Đã tự động tạo dữ liệu tài khoản mẫu (Admin & Librarian).');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
