import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

// install cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_API_SECRET
  });

// middlewares
app.use(express.json()); //parse JSON data in req.body
app.use(express.urlencoded({ extended: true })); //parse form data in the req.body
app.use(cookieParser()); //get the cookie from req then set the cookie inside response

// routes
app.use("/api/users",userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});