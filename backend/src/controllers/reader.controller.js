const { Reader } = require('../models');

// UC05 & UC06: Đăng ký thẻ (Bao gồm phát sinh số thẻ)
exports.registerReader = async (req, res) => {
  const { studentId, fullName, email, phoneNumber, className, dateOfBirth, gender } = req.body;

  try {
    const cardId = 'LIB-' + Date.now().toString().slice(-8);
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(issueDate.getFullYear() + 1);

    const reader = await Reader.create({
      studentId, fullName, email, phoneNumber, cardId, issueDate, expiryDate, status: 'ACTIVE', className, dateOfBirth, gender
    });

    res.status(201).json({ success: true, message: 'Đăng ký thẻ thành công!', data: reader });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UC07: Sửa thông tin thẻ/độc giả
exports.updateReader = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ message: 'Không tìm thấy độc giả!' });
    await reader.update(req.body);
    res.status(200).json({ success: true, data: reader });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UC08: Xóa thẻ độc giả
exports.deleteReader = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ message: 'Không tìm thấy độc giả!' });
    await reader.destroy();
    res.status(200).json({ success: true, message: 'Đã xóa thẻ độc giả thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UC15: Kiểm tra thẻ độc giả bằng cardId
exports.checkReaderCard = async (req, res) => {
  try {
    const reader = await Reader.findOne({ where: { cardId: req.params.cardId } });
    if (!reader) return res.status(404).json({ success: false, message: 'Không tìm thấy thẻ độc giả!' });
    const isExpired = new Date(reader.expiryDate) < new Date();
    res.status(200).json({ success: true, data: reader, isExpired });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách độc giả
exports.getAllReaders = async (req, res) => {
  const readers = await Reader.findAll();
  res.status(200).json({ success: true, data: readers });
};
