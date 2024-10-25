import express from "express"
import { adminlogin,addProduct,removeProduct, listProduct ,userlist} from "../controllers/adminController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const adminRouter=express.Router()


adminRouter.post("/login",adminlogin)
adminRouter.post("/add-product",adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},
                                        {name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
adminRouter.get("/list-allproducts",listProduct)
                                        
adminRouter.post("/remove-product",adminAuth,removeProduct)
adminRouter.post("/user-list",adminAuth,userlist)









export default adminRouter;