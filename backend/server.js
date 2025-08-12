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



const port=process.env.PORT || 4000
const app = express()

connectDB();



connectCloudinary();

const corsOptions = {
  origin: ['https://ecomerce-frontend-mu.vercel.app',"https://e-commerce-admin-alpha-steel.vercel.app","http://localhost:5173","http://localhost:5174"],
  credentials: true,
};
app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser());



//endpoints
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/product",productRouter)
app.use("/api/order",orderRouter)


    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
 



