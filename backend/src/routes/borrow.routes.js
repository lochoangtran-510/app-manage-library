const express = require('express');
const router = express.Router();
const { createBorrowing, getBorrowRecords, getActiveBorrowingsByReader, returnBook } = require('../controllers/borrow.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('LIBRARIAN', 'ADMIN'));

router.get('/', getBorrowRecords);
router.get('/active/:cardId', getActiveBorrowingsByReader);
router.put('/return/:id', returnBook); // UC17-18
router.post('/', createBorrowing);

module.exports = router;
