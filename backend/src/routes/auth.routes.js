const express = require('express');
const router = express.Router();
const { login, logout, seedAdmin } = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/logout', logout);
router.post('/seed-admin', seedAdmin);

module.exports = router;
