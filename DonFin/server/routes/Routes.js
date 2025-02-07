const express = require('express');
const { createUser, loginUser } = require('../controllers/Controller');
const router = express.Router();

// Register route
router.post('/register', createUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
