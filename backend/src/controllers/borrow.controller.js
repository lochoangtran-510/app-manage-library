const { BorrowRecord, BookCopy, Reader, Book, sequelize } = require('../models');
const { Op } = require('sequelize');

// UC14-UC16: Ghi nhận phiếu mượn (Bulk)
exports.createBorrowing = async (req, res) => {
  const { readerId, copyIds, dueDate } = req.body;
  const librarianId = req.user.id; // Lấy mã thủ thư đang đăng nhập
  
  if (!copyIds || copyIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn sách để mượn!' });
  }

  // 1. Kiểm tra quy định: Một lần mượn chỉ được mượn đúng 1 cuốn sách
  if (copyIds.length > 1) {
    return res.status(400).json({ success: false, message: 'Quy định thư viện: Mỗi độc giả chỉ được mượn TỐI ĐA 1 CUỐN SÁCH trong một lần mượn!' });
  }

  const transaction = await sequelize.transaction();
  try {
    // 2. Kiểm tra xem độc giả này có đang giữ cuốn sách nào chưa trả không
    const activeBorrowStats = await BorrowRecord.count({
      where: { readerId, status: 'BORROWING' },
      transaction
    });
    if (activeBorrowStats > 0) {
      throw new Error('Độc giả này đang mượn 1 cuốn sách chưa trả. Phải trả sách cũ mới được mượn tiếp!');
    }

    // Kiểm tra ngày trả không được ở quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDueDate = new Date(dueDate);
    if (selectedDueDate < today) {
      throw new Error('Hạn trả không được phép ở quá khứ!');
    }

    for (const copyId of copyIds) {
      const copy = await BookCopy.findByPk(copyId, { transaction });
      if (!copy) throw new Error(`Không tìm thấy sách mã ID: ${copyId}`);
      if (copy.status !== 'AVAILABLE') throw new Error(`Sách ${copy.barcode} hiện đang không sẵn sàng!`);
      
      await BorrowRecord.create({
        readerId, 
        bookCopyId: copyId,
        librarianId, // Thêm thông tin mã thủ thư
        borrowDate: new Date(),
        dueDate: selectedDueDate,
        status: 'BORROWING'
      }, { transaction });
      
      await copy.update({ status: 'BORROWED' }, { transaction });
    }
    await transaction.commit();
    res.status(201).json({ success: true, message: 'Mượn sách thành công!' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Lỗi mượn sách:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// UC17: Tìm sách đang mượn của độc giả
exports.getActiveBorrowingsByReader = async (req, res) => {
  const { cardId } = req.params;
  try {
    const reader = await Reader.findOne({ where: { cardId } });
    if (!reader) return res.status(404).json({ message: 'Không tìm thấy độc giả!' });

    const records = await BorrowRecord.findAll({
      where: { readerId: reader.id, status: 'BORROWING' },
      include: [{ model: BookCopy, as: 'bookCopy', include: ['book'] }]
    });
    res.status(200).json({ success: true, reader, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UC17-18: Ghi nhận trả sách
exports.returnBook = async (req, res) => {
  const { id } = req.params;
  const { condition = 'Bình thường' } = req.body; // UC17: Tình trạng lúc trả

  const transaction = await sequelize.transaction();
  try {
    const record = await BorrowRecord.findByPk(id, { transaction });
    if (!record || record.status === 'RETURNED') throw new Error('Phiếu mượn không hợp lệ!');

    // Cập nhật phiếu mượn
    await record.update({
      returnDate: new Date(),
      status: 'RETURNED',
      notes: condition
    }, { transaction });

    // Cập nhật tình trạng sách (UC18)
    const copy = await BookCopy.findByPk(record.bookCopyId, { transaction });
    await copy.update({ status: 'AVAILABLE' }, { transaction });

    await transaction.commit();
    res.status(200).json({ success: true, message: 'Đã trả sách thành công!' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

exports.getBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.findAll({ include: ['reader', { model: BookCopy, as: 'bookCopy', include: ['book'] }] });
  res.json({ success: true, data: records });
};
