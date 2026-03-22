require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}));

app.use(express.json({limit: "20kb"}));   // json format mai data lana ke liye 
app.use(express.urlencoded());    //URL se data lane ke liye
app.use(express.static("public"));   //PDF ya koi folder store krne ke liye


// database connection
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port : ${process.env.PORT || 8000}`);   //then or catch ka use krna imp. hai kyu ki kabhi kabhi server nhi chalta to pata chalna chaiye 
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
});

