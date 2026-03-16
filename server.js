require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const app = express();

// database connection
connectDB();

app.use(express.json());
const userRoutes = require("./src/routes/user.routes");

app.use('/api/users', userRoutes);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});