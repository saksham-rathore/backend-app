app.use(express.json());
const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes");

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);