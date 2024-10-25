import productModel from "../models/productModel.js"





const listProduct=async(req,res)=>{
 
     try {
        const products= await productModel.find({})
        res.json({
            success:true,
            products
        })
        
     } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message})
        
     }
}


const singleProduct=async(req,res)=>{
  
    try {
        const { productId } = req.params;
        const product= await productModel.findById(productId)
        res.json({
            success: true,
            product
        })  
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message})
    }
}


const latestproduct=async(req,res)=>{
    try {
        const lastTenProduct=await productModel.find({})
        .sort({ createdAt: -1 })
        .limit(10);

        if(!lastTenProduct || lastTenProduct.length === 0){
            return res.json({
                success:false,
                message:"There is no products in database.."
            })
        }

        res.json({
           success:true,
           lastTenProduct
        })
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message: error.message})
    }
}



const bestsellers=async(req,res)=>{
    try {
        const bestSells=await productModel.find({bestseller:true})
        .sort({ createdAt: -1 })
        .limit(5);
        
        
        if(!bestSells || bestSells.length === 0){
            return res.json({
                success:false,
                message:"There are no best-selling products in the database.."
            })
        }

        
        res.json({
            success:true,
            bestSells
         })
        
    } catch (error) {
        return res.json({success:false,message:error.message})
       
    }
}



const filterProducts = async (req, res) => {
    try {
        const { search, category, subCategory, sortType } = req.query;
        let query = {};

      

        if (search) {
            query.name = { $regex: search, $options: 'i' }; 
        }

        if (category) {
            const categoriesArray = Array.isArray(category) ? category : category.split(',');
            query.category = { $in: categoriesArray }; 
        }

        if (subCategory) {
            const subcategoriesArray = Array.isArray(subCategory) ? subCategory : subCategory.split(',');
            query.subCategory = { $in: subcategoriesArray }; 
        }

        let productsQuery = productModel.find(query);

        if (sortType === "low-high") {
            productsQuery = productsQuery.sort({ price: 1 }); 
        } else if (sortType === "high-low") {
            productsQuery = productsQuery.sort({ price: -1 }); 
        }

        const products = await productsQuery.exec();

        res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error(error);
        return res.json({success:false,message:error.message})
         
    }
}




const getRelatedProducts = async (req, res) => {
    const { category, subCategory, currentProductId } = req.body; 
    
    
    if (!category || !subCategory) {
        return res.status(400).json({ success:false, message: 'Category and subCategory are required.' });
    }

    try {
        
        const relatedProducts = await productModel.find({ 
            category: category,
            subCategory: subCategory,
            _id: { $ne: currentProductId } 
        })
         .sort({ createdAt: -1 })
        .limit(5);

        if (relatedProducts.length === 0) {
            return res.status(404).json({ success:false, message: 'No related products found.' });
        }

        return res.status(200).json({success:true,relatedProducts});

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
};






export { listProduct,singleProduct,latestproduct,bestsellers,filterProducts,getRelatedProducts}