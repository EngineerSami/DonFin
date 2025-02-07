//Routes.js
const express = require('express');
const { createUser, loginUser, addMonth, getUserMonths } = require('../controllers/Controller');
const router = express.Router();

// Register route
router.post('/register', createUser);

// Login route
router.post('/login', loginUser);

// Add Month route
router.post("/add-month", addMonth);

router.get("/:userId/months", getUserMonths);

module.exports = router;
