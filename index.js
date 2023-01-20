const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const user_routes = require("./routes/userRoutes");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", user_routes);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(7777);
        console.log('Server is now listening on port : 7777')
    })
    .catch((err) => console.log("erreur: " + err))