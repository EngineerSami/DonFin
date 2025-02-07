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

module.exports = { createUser, loginUser, addMonth, getUserMonths, deleteMonth };
