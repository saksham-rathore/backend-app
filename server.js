require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const app = express();

// database connection
connectDB();

app.use(express.json());
const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes");

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});