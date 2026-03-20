const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect); // Tất cả các UC mượn/trả cần đăng nhập

router.route('/')
  .get(getCategories)
  .post(authorize('LIBRARIAN'), createCategory);

router.route('/:id')
  .put(authorize('LIBRARIAN'), updateCategory)
  .delete(authorize('LIBRARIAN'), deleteCategory);

module.exports = router;
