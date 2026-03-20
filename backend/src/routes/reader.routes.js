const express = require('express');
const router = express.Router();
const { registerReader, updateReader, deleteReader, getAllReaders, checkReaderCard } = require('../controllers/reader.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(authorize('LIBRARIAN'));

router.get('/check/:cardId', checkReaderCard);

router.route('/')
  .get(getAllReaders)
  .post(registerReader);

router.route('/:id')
  .put(updateReader)
  .delete(deleteReader);

module.exports = router;
