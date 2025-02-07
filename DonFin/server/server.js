require('dotenv').config();
require('./config/mongoose.config'); 
const userRoutes = require('./routes/Routes');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);




app.listen(port, () => {
    console.log(`Listening at Port ${port}`);
});