const express = require('express');
const router = express.Router();
const { createLibrarian, updateLibrarian, deleteLibrarian, getLibrarians } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Routes bảo vệ: Chỉ Admin được phép truy cập CRUD thủ thư
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(getLibrarians)
  .post(createLibrarian);

router.route('/:id')
  .put(updateLibrarian)
  .delete(deleteLibrarian);

module.exports = router;
