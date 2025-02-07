const User = require('../models/Model'); // Import the User model

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Directly compare the plain text password (no hashing)
      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      // If successful, return user data (excluding password)
      res.status(200).json({ message: "Login successful", user: { ...user.toObject(), password: undefined } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };
  
  

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

module.exports = { createUser, loginUser };
