import commentmodel from "../models/commentModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"





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
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            const categoriesArray = Array.isArray(category) ? category : category.split(',');
            query.category = categoriesArray.length === 1 ? categoriesArray[0] : { $in: categoriesArray };
        }

        if (subCategory) {
            const subcategoriesArray = Array.isArray(subCategory) ? subCategory : subCategory.split(',');
            query.subCategory = subcategoriesArray.length === 1 ? subcategoriesArray[0] : { $in: subcategoriesArray };
        }

        let productsQuery = productModel.find(query)
            .lean()
            .maxTimeMS(1000)
            .allowDiskUse(true);

        if (search) {
            productsQuery = productsQuery.sort({ score: { $meta: "textScore" } });
        } 
        else if (sortType === "low-high") {
            productsQuery = productsQuery.sort({ price: 1 }).hint({ price: 1 });
        } else if (sortType === "high-low") {
            productsQuery = productsQuery.sort({ price: -1 }).hint({ price: 1 });
        }else {
            productsQuery.sort({ createdAt: -1 });
        }

        const products = await productsQuery.exec();

        
        return res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('Filter error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};



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



const SendComment=async(req,res)=>{

    const {userId,productId,comment}=req.body;

    try {

      const user=await userModel.findById(userId)
      if(!user){
        return res.json({success:false,message:"Please login ,unauthorized"})
      }
      const name=user.name;

      const newCooment= new commentmodel({
         username: name,
         productId,
         comment
      })
      await newCooment.save()
  
      res.json({success:true,message:"succesfully created"})
      
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}


const productComments=async(req,res)=>{

    const { productId } = req.query;

    try {
       
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

     
        const comments = await commentmodel.find({ productId }).select('username comment');

       
        return res.json({ success: true, comments });
        
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}



export { 
    listProduct,
    singleProduct,
    latestproduct,
    bestsellers,
    filterProducts,
    getRelatedProducts,
    SendComment,
    productComments
}