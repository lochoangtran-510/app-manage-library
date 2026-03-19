const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware xác thực Token (UC01 extend)
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra token từ Header hoặc Cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để truy cập!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// Middleware phân quyền - Chỉ cho phép Admin (UC02-04)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Quyền của bạn (${req.user.role}) không được phép thực hiện hành động này!` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
