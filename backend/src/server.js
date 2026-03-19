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
    
    // Sync models (ở giai đoạn phát triển, ta dùng alter: true hoặc manual migrations)
    await db.sequelize.sync({ alter: true });
    console.log('✅ All tables synchronized in PostgreSQL.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
