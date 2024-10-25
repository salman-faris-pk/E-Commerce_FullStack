import express from "express"
import { listProduct,singleProduct,latestproduct,bestsellers,filterProducts,getRelatedProducts} from "../controllers/productController.js"

const productRouter=express.Router()


productRouter.get("/list-product",listProduct)
productRouter.post("/single-product/:productId",singleProduct)
productRouter.get("/latest-products",latestproduct)
productRouter.get("/best-sellers",bestsellers)
productRouter.get("/all-collections",filterProducts)
productRouter.post("/related-products",getRelatedProducts)





export default productRouter