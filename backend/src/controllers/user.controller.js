const bcrypt = require('bcryptjs');
const { User } = require('../models');

// UC02: Thêm tài khoản thủ thư (Chỉ Admin)
exports.createLibrarian = async (req, res) => {
  const { username, password, email, fullName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      fullName,
      role: 'LIBRARIAN'
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UC03: Sửa thông tin thủ thư
exports.updateLibrarian = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'LIBRARIAN') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thủ thư!' });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.update(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UC04: Xóa thủ thư 
exports.deleteLibrarian = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'LIBRARIAN') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thủ thư!' });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: 'Đã xóa tài khoản thủ thư!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách thủ thư
exports.getLibrarians = async (req, res) => {
  const users = await User.findAll({ where: { role: 'LIBRARIAN' } });
  res.status(200).json({ success: true, data: users });
};
