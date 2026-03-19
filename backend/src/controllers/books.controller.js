const { Book, BookCopy, Category, sequelize } = require('../models');

// UC09 & UC10: Nhập đầu sách mới và ít nhất 1 bản sao
exports.createBook = async (req, res) => {
  const { title, author, isbn, publisher, publishYear, categoryId, initialCopies = 1 } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const book = await Book.create({
      title, author, isbn, publisher, publishYear, categoryId
    }, { transaction });

    const copies = [];
    for (let i = 0; i < initialCopies; i++) {
      copies.push({
        bookId: book.id,
        barcode: `BC-${Date.now()}-${i}`,
        status: 'AVAILABLE',
        location: 'Khu A-01'
      });
    }
    await BookCopy.bulkCreate(copies, { transaction });

    await transaction.commit();
    res.status(201).json({ success: true, data: book, message: `Đã nhập đầu sách và ${initialCopies} bản sao!` });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách!' });
    await book.update(req.body);
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy đầu sách!' });
    await book.destroy(); 
    res.status(200).json({ success: true, message: 'Đã xóa đầu sách!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooks = async (req, res) => {
  const books = await Book.findAll({
    include: [
      { model: Category, as: 'category' },
      { model: BookCopy, as: 'copies' }
    ]
  });
  res.status(200).json({ success: true, data: books });
};

exports.getOneBook = async (req, res) => {
  const book = await Book.findByPk(req.params.id, {
    include: [{ model: Category, as: 'category' }, { model: BookCopy, as: 'copies' }]
  });
  if (!book) return res.status(404).json({ message: 'Không tìm thấy sách!' });
  res.status(200).json({ success: true, data: book });
};

// UC16: Kiểm tra bản sao sách bằng barcode
exports.checkBookCopy = async (req, res) => {
  try {
    const copy = await BookCopy.findOne({ 
      where: { barcode: req.params.barcode },
      include: [{ model: Book, as: 'book' }]
    });
    if (!copy) return res.status(404).json({ success: false, message: 'Không tìm thấy bản sao!' });
    res.status(200).json({ success: true, data: copy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
