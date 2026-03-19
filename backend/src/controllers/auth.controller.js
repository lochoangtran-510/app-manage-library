const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// UC01: Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu sai!' });
    }

    // Tạo Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    // Gửi trong Cookie (Session-like)
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };

    res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Đã đăng xuất thành công!' });
};

// Endpoint đặc biệt để tạo admin đầu tiên (Seed dev)
exports.seedAdmin = async (req, res) => {
  try {
    const userCount = await User.count();
    if (userCount > 0) return res.status(400).json({ message: 'Đã có người dùng trong hệ thống!' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      fullName: 'Super Admin',
      email: 'admin@library.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    res.status(201).json({ success: true, message: 'Đã tạo admin mặc định (user: admin, pass: admin123)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
