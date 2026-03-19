const { BorrowRecord, Book, BookCopy, Reader, sequelize } = require('../models');
const { Op } = require('sequelize');

// UC19: Thống kê top 10 đầu sách mượn nhiều nhất
exports.getTopBooks = async (req, res) => {
  try {
    // Chúng ta lấy tổng hợp từ bảng BorrowRecord, link tới Book qua BookCopy
    const stats = await BorrowRecord.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('BorrowRecord.id')), 'borrowCount'],
        [sequelize.col('bookCopy->book.title'), 'bookTitle']
      ],
      include: [{
        model: BookCopy,
        as: 'bookCopy',
        attributes: [],
        include: [{ model: Book, as: 'book', attributes: [] }]
      }],
      group: ['bookCopy->book.id', 'bookCopy->book.title'],
      order: [[sequelize.literal('"borrowCount"'), 'DESC']],
      limit: 10,
      raw: true
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UC20: Thống kê độc giả quá hạn chưa trả
exports.getOverdueReaders = async (req, res) => {
  try {
    const today = new Date();
    const overdue = await BorrowRecord.findAll({
      where: {
        status: 'BORROWING',
        dueDate: { [Op.lt]: today }
      },
      include: [
        { model: Reader, as: 'reader' },
        { model: BookCopy, as: 'bookCopy', include: ['book'] }
      ]
    });
    res.json({ success: true, data: overdue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
