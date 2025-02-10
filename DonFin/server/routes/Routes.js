const express = require('express');
const { createUser, loginUser, addMonth, getUserMonths, deleteMonth, editUser, getUser, getMonthDetails, updateMonthBudget, createExpense } = require('../controllers/Controller');
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

router.put("/:userId/edit", editUser);

router.get("/:userId", getUser);

router.get("/:userId/month/:monthId", getMonthDetails);

// Update Month Budget route
router.put("/:userId/month/:monthId", updateMonthBudget);

router.post("/:userId/month/:monthId/add-expense", createExpense);


module.exports = router;
