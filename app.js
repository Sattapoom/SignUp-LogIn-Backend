require('dotenv').config();
require('./config/db').connect();

const express = require('express');

const app = express();
const cors = require('cors');

const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.json());

require("./routes/app.routes")(app);

module.exports = app;