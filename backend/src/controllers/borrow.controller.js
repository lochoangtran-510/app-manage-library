const { BorrowRecord, BookCopy, Reader, Book, sequelize } = require('../models');
const { Op } = require('sequelize');

// UC14-UC16: Ghi nhận phiếu mượn (Bulk)
exports.createBorrowing = async (req, res) => {
  const { readerId, copyIds, dueDate } = req.body;
  const transaction = await sequelize.transaction();
  try {
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
