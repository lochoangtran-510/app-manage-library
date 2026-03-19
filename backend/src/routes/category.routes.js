const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect); // Tất cả các UC mượn/trả cần đăng nhập

router.route('/')
  .get(getCategories)
  .post(authorize('LIBRARIAN', 'ADMIN'), createCategory);

router.route('/:id')
  .put(authorize('LIBRARIAN', 'ADMIN'), updateCategory)
  .delete(authorize('LIBRARIAN', 'ADMIN'), deleteCategory);

module.exports = router;
