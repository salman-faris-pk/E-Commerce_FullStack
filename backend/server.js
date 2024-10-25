import express from "express"
import cors from "cors"
import 'dotenv/config';
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js"
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";



const app = express()
const port= process.env.PORT || 4000

connectDB();
connectCloudinary();


app.use(express.json())
app.use(cors());
app.use(cookieParser());

//endpoints
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/product",productRouter)
app.use("/api/order",orderRouter)





app.listen(port,()=>{
    console.log("server runs on ", port);
    
})