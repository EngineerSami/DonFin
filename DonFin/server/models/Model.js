//Models.js

const mongoose = require('mongoose');

const MonthSchema = new mongoose.Schema(
  {
    monthTitle: {
      type: String,
      required: [true, 'Month title is required.'],
      minlength: [3, 'Month title must be at least 3 characters long.'],
      maxlength: [50, 'Month title cannot exceed 50 characters.'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required.'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required.'],
      min: [0, 'Budget must be greater than or equal to 0.'],
    },
  },
  { timestamps: true }
);

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
    months: [MonthSchema], // Array of months
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
