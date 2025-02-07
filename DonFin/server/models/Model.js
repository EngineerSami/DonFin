const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      minlength: [3, 'First name must be at least 3 characters long.'],
      maxlength: [20, 'First name cannot exceed 20 characters.'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      minlength: [3, 'Last name must be at least 3 characters long.'],
      maxlength: [20, 'Last name cannot exceed 20 characters.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
