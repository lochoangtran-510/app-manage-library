const { sequelize, connectDB } = require('../config/database');

// Import all models
const User = require('./user.model');
const Reader = require('./reader.model');
const Category = require('./category.model');
const Book = require('./book.model');
const BookCopy = require('./bookCopy.model');
const BorrowRecord = require('./borrowRecord.model');

// Define Relationships (Associations)

// Category <-> Book (1:N)
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Book <-> BookCopy (1:N)
Book.hasMany(BookCopy, { foreignKey: 'bookId', as: 'copies' });
BookCopy.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// Reader <-> BorrowRecord (1:N)
Reader.hasMany(BorrowRecord, { foreignKey: 'readerId', as: 'borrowings' });
BorrowRecord.belongsTo(Reader, { foreignKey: 'readerId', as: 'reader' });

// BookCopy <-> BorrowRecord (1:N)
BookCopy.hasMany(BorrowRecord, { foreignKey: 'bookCopyId', as: 'borrowHistory' });
BorrowRecord.belongsTo(BookCopy, { foreignKey: 'bookCopyId', as: 'bookCopy' });

// User (Librarian) <-> BorrowRecord (1:N) - Để biết ai thực hiện giao dịch
User.hasMany(BorrowRecord, { foreignKey: 'librarianId', as: 'processedRecords' });
BorrowRecord.belongsTo(User, { foreignKey: 'librarianId', as: 'librarian' });

const db = {
  sequelize,
  models: {
    User,
    Reader,
    Category,
    Book,
    BookCopy,
    BorrowRecord,
  },
};

module.exports = { db, sequelize, connectDB, ...db.models };
