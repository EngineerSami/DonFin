require('dotenv').config();
require('./config/mongoose.config'); 

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

    const userRoutes = require('./routes/Routes');

    app.use(userRoutes); 



app.listen(port, () => {
    console.log(`Listening at Port ${port}`);
});