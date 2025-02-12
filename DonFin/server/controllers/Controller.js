const User = require('../models/Model'); // Import the User model
const mongoose = require('mongoose');  // Import mongoose

// Login logic
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Register logic
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Add Month logic
const addMonth = async (req, res) => {
  try {
    const { userId, monthTitle, startDate, endDate, budget } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newMonth = {
      _id: new mongoose.Types.ObjectId(), // Generate unique ID for the month
      monthTitle,
      startDate,
      endDate,
      budget
    };

    user.months.push(newMonth);
    await user.save();

    res.status(201).json({ message: "Month added successfully", month: newMonth });
  } catch (error) {
    console.error("Error adding month:", error);
    res.status(500).json({ message: "Error adding month", error: error.message });
  }
};

// Fetch user's months
const getUserMonths = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("months");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ months: user.months });
  } catch (error) {
    res.status(500).json({ message: "Error fetching months", error: error.message });
  }
};

// Delete Month logic
const deleteMonth = async (req, res) => {
  try {
    const { userId, monthId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(monthId)) {
      return res.status(400).json({ message: "Invalid userId or monthId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the month to be deleted
    user.months = user.months.filter((month) => month._id.toString() !== monthId);

    await user.save();
    res.status(200).json({ message: "Month deleted successfully" });
  } catch (error) {
    console.error("Error deleting month:", error);
    res.status(500).json({ message: "Error deleting month", error: error.message });
  }
};

// Edit User logic
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, oldPassword, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If old password is provided, verify it first
    if (oldPassword && newPassword) {
      if (oldPassword !== user.password) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      // Update the password directly (no hashing)
      user.password = newPassword;
    }

    // Update other fields if provided
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    // Save the updated user
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

const getMonthDetails = async (req, res) => {
  try {
    const { userId, monthId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(monthId)) {
      return res.status(400).json({ message: "Invalid userId or monthId format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const month = user.months.find((m) => m._id.toString() === monthId);
    if (!month) {
      return res.status(404).json({ message: "Month not found" });
    }

    res.status(200).json(month);  // Include currentBudget in the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching month details", error: error.message });
  }
};

const updateMonthBudget = async (req, res) => {
  try {
    const { userId, monthId } = req.params;
    const { currentBudget } = req.body;  // The new budget value

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(monthId)) {
      return res.status(400).json({ message: "Invalid userId or monthId format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const month = user.months.find((m) => m._id.toString() === monthId);
    if (!month) {
      return res.status(404).json({ message: "Month not found" });
    }

    month.currentBudget = currentBudget;  // Update the current budget

    await user.save();  // Save the changes to the database

    res.status(200).json({ message: "Budget updated successfully", month });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Error updating budget", error: error.message });
  }
};


const createExpense = async (req, res) => {
  try {
    const { userId, monthId } = req.params;
    const { type, description, cost, date } = req.body;

    // Validate userId and monthId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(monthId)) {
      return res.status(400).json({ message: "Invalid userId or monthId" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the month by ID
    const month = user.months.find((m) => m._id.toString() === monthId);
    if (!month) return res.status(404).json({ message: "Month not found" });

    // Validate that the cost is a number and greater than zero
    if (isNaN(cost) || cost <= 0) {
      return res.status(400).json({ message: "Invalid cost value" });
    }

    // Check if the expense exceeds the current budget
    if (month.currentBudget - cost < 0) {
      return res.status(400).json({ message: "Insufficient budget" });
    }

    // Validate and format the date
    const expenseDate = new Date(date);
    if (isNaN(expenseDate)) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // Create a new expense object with the correct date format
    const newExpense = { type, description, cost, date: expenseDate };

    // Add expense to the month and deduct from the budget
    month.expenses.push(newExpense);
    month.currentBudget -= cost;

    // Save the updated user document
    await user.save();

    // Respond with success message and the new expense
    res.status(201).json({ message: "Expense added successfully", expense: newExpense });

  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};






module.exports = { createUser, loginUser, addMonth, getUserMonths, deleteMonth, editUser, getUser, getMonthDetails, updateMonthBudget, createExpense };
