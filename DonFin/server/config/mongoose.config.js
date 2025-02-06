require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// Fetch the values from the environment variables
const dbName = process.env.DB;
const username = process.env.ATLAS_USERNAME;
const pw = encodeURIComponent(process.env.ATLAS_PASSWORD); // Ensure password is URL encoded

// Create the MongoDB connection string
const uri = `mongodb+srv://${username}:${pw}@mycluster.ypx3l.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=MyCluster`;

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));
