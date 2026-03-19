const { Category } = require('../models');

// UC13: Quản lý chuyên ngành
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json({ success: true, data: categories });
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy chuyên ngành!' });
    await category.update(req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy chuyên ngành!' });
    await category.destroy();
    res.status(200).json({ success: true, message: 'Đã xóa chuyên ngành!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
