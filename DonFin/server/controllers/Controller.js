//Controller.js

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
// Add Month logic
const addMonth = async (req, res) => {
    try {
      const { userId, monthTitle, startDate, endDate, budget } = req.body;
  
      // Ensure userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Create the new month object
      const newMonth = {
        monthTitle,
        startDate,
        endDate,
        budget
      };
  
      // Push the new month to the user's months array
      user.months.push(newMonth);
  
      // Save the user with the new month added
      await user.save();
  
      res.status(201).json({ message: "Month added successfully", month: newMonth });
    } catch (error) {
      console.error("Error adding month:", error);
      res.status(500).json({ message: "Error adding month", error: error.message });
    }
  };
  

  // Controller.js

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

module.exports = { createUser, loginUser, addMonth, getUserMonths };


