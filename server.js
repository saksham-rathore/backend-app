require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const app = express();

// database connection
connectDB();

app.listen(3000, () => {
    console.log("Server started on port 3000");
});