const express = require('express');
const router = express.Router();
const { createBook, getBooks, updateBook, deleteBook, getOneBook, checkBookCopy } = require('../controllers/books.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', getBooks);
router.get('/copy-check/:barcode', protect, checkBookCopy);
router.get('/:id', getOneBook);

router.use(protect);
router.use(authorize('LIBRARIAN', 'ADMIN'));

router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
