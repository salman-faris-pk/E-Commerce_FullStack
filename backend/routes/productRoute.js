import express from "express"
import { listProduct,singleProduct,latestproduct,bestsellers,filterProducts,getRelatedProducts,SendComment,productComments} from "../controllers/productController.js"
import authUser from "../middleware/auth.js"
const productRouter=express.Router()


productRouter.get("/list-product",listProduct)
productRouter.post("/single-product/:productId",singleProduct)
productRouter.get("/latest-products",latestproduct)
productRouter.get("/best-sellers",bestsellers)
productRouter.get("/all-collections",filterProducts)
productRouter.post("/related-products",getRelatedProducts)
productRouter.post("/postcomment",authUser,SendComment)
productRouter.post("/postcomment",authUser,SendComment)
productRouter.get("/comments",productComments)





export default productRouter