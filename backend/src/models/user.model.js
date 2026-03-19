const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'LIBRARIAN'),
    defaultValue: 'LIBRARIAN',
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // TRUE: Hoạt động, FALSE: Bị khóa
  }
}, {
  timestamps: true,
});

module.exports = User;
