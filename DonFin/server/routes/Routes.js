const express = require('express');
const { createUser, loginUser, addMonth, getUserMonths, deleteMonth } = require('../controllers/Controller');
const router = express.Router();

// Register route
router.post('/register', createUser);

// Login route
router.post('/login', loginUser);

// Add Month route
router.post("/add-month", addMonth);

// Get user's months route
router.get("/:userId/months", getUserMonths);

// Delete Month route
router.delete("/:userId/delete-month/:monthId", deleteMonth);

module.exports = router;
