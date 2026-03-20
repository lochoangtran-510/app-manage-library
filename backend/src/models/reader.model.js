const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reader = sequelize.define('Reader', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },
  className: {
    type: DataTypes.STRING,
    defaultValue: 'Chưa cập nhật',
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    defaultValue: '2000-01-01',
  },
  gender: {
    type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
    defaultValue: 'Nam',
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  cardId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXPIRED'),
    defaultValue: 'ACTIVE',
  }
}, {
  timestamps: true,
});

module.exports = Reader;
