const express = require('express');
const router = express.Router();
const { getTopBooks, getOverdueReaders } = require('../controllers/report.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('LIBRARIAN', 'ADMIN'));

router.get('/top-books', getTopBooks);
router.get('/overdue', getOverdueReaders);

module.exports = router;
