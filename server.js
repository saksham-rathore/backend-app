import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "20kb"}));   // json format mai data lana ke liye 
app.use(express.urlencoded({extended: true}));    //URL se data lane ke liye
app.use(express.static("public"));   //PDF ya koi folder store krne ke liye

//routes import
import userRouter from "./src/routes/user.routes.js"

//Routes declaration
app.use("/api/v1/users", userRouter)


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