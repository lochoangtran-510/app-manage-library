const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookCopy = sequelize.define('BookCopy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'BORROWED', 'DAMAGED', 'LOST'),
    defaultValue: 'AVAILABLE',
  },
  location: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
});

module.exports = BookCopy;
