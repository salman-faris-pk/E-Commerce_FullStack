import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import ordermodel from "../models/orderModel.js"




const adminlogin=async(req,res)=>{

 try {

  const {email,password}=req.body;

   if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    
    const token = jwt.sign(
      { email, role: 'admin' },  
      process.env.JWT_SECRET,
      { expiresIn: '2d' } 
    );
    
     res.json({
      success:true,
      token
    })

   }else{
    res.json({
      success:false,
      message:"Invalid credentials or inputs.."
    })
   }

 } catch (error) {
  console.log(error);
     res.json({success:false,message:error.message})
 }

}



const addProduct= async(req,res)=>{
  try {
    
     const {name,description,price,category,subCategory,sizes,bestseller}=req.body;

     const image1= req.files.image1 && req.files.image1[0]
     const image2= req.files.image2 && req.files.image2[0]
     const image3= req.files.image3 && req.files.image3[0]
     const image4= req.files.image4 && req.files.image4[0]


     const images= [image1,image2,image3,image4].filter((item)=> item !== undefined)

      let imageUrl= await Promise.all(
        images.map(async(item)=> {
             let result= await cloudinary.uploader.upload(item.path,{resource_type:'image'});
             return result.secure_url
        })
      )

     const productData= {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        sizes: JSON.parse(sizes),
        bestseller: bestseller === "true" ? true : false ,
        image: imageUrl,
     };

     const product= new productModel(productData)
       await product.save();

       res.json({
        success: true,
        message:"Product added succesfully..!"
       })

  } catch (error) {
    console.log(error);
     res.json({success:false,message:error.message})
  }
}

const removeProduct= async(req,res)=>{

   try {
    await productModel.findByIdAndDelete(req.body.id)
    res.json({
      success:true,message:"product removed succefuly!"
    })
    
   } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
   }

}

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


const userlist=async(req,res)=>{
  try {

    const users=await userModel.find({}).select('_id name email')   
   
    const userStats = await Promise.all(users.map(async (user) => {

      const orders = await ordermodel.find({ userId: user._id }).select('items amount');

      const purchaseItemCount = orders.reduce((count, order) => count + order.items.length, 0);
      const totalAmountSpent = orders.reduce((total, order) => total + order.amount, 0);

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        purchaseItemCount,
        totalAmountSpent,
      };
    }));

    
     res.json({success:true,message:"sucessfull!",userStats})
    
  } catch (error) {
    res.json({success:false,message: error.message})
  }
}


const OrderChartStats=async(req,res)=>{
  try {
    const orders = await ordermodel.find({ payment: true });
 

    const categoryCount = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const productCategory = item.category;

        if (categoryCount[productCategory]) {
          categoryCount[productCategory] += item.quantity; 
        } else {
          categoryCount[productCategory] = item.quantity; 
        }
      });
    });

    const data = Object.keys(categoryCount).map(category => ({
      name: category,
      count: categoryCount[category],
    }));

    res.json({ success: true, data });
    
  } catch (error) {
    res.json({success:false,message: error.message})
    
  }
}


const Profits=async(req,res)=>{
  try {
  
  const orders=await ordermodel.find({ payment: true});

  const totalPrice = orders.reduce((acc, order) => {
    return acc + order.amount;
}, 0);

const Profit = parseFloat((totalPrice * 0.7).toFixed(0));

const order=await ordermodel.find({ payment: false});

const lTotal = order.reduce((acc, ord) => {
  return acc + ord.amount;
}, 0);

const pending = parseFloat((lTotal * 0.7).toFixed(0));

const totalCombined = totalPrice + lTotal;
const profitPer = parseFloat(((Profit / totalCombined) * 100).toFixed(0));
const pendingPer = parseFloat(((pending / totalCombined) * 100).toFixed(0));




res.json({success:true,data:{Profit,profitPer,pending,pendingPer}})
 
    
  } catch (error) {
    res.json({success:false,message: error.message})
    
  }
}



const Totalstatics=async(req,res)=>{
  try {

    const userCount = await userModel.countDocuments();
    const productCount = await productModel.countDocuments();
    const orderCount = await ordermodel.countDocuments();
    const salesCount = await ordermodel.countDocuments({ payment: true });
    

   res.json({
    success:true,
    userCount,
    productCount,
    orderCount,
    salesCount
   })
    
    
  } catch (error) {
    res.json({success:false,message: error.message})
  }
}



export { 
  adminlogin, 
  addProduct,
  removeProduct,
  listProduct,
  userlist,
  OrderChartStats,
  Profits,
  Totalstatics
}