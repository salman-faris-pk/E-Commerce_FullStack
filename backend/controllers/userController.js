import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";



const createToken =(id)=>{
  return jwt.sign({id},process.env.TOKEN_SECRET)
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user doesn't exists...",
      });
    }

    const isMatchPass = await bcrypt.compare(password, user.password);

    if (isMatchPass) {
      const token= createToken(user._id)
      return res.json({
        success: true,
        token
      });
    } else {
      res.json({
        success: false,
        message: "invalid credentials....",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.json({
        success: false,
        message: "user already exists...",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: "false",
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: "false",
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedpass,
    });

    const user = await newUser.save();

    const token = createToken(user._id)

    return res.json({
      success: true,
      token
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




const addtoCart = async (req, res) => {
  const { userId,productId, size, price } = req.body;

      
  
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if(!size){
      return res
        .status(404)
        .json({ success: false, message: "Please select a size" });
    }

    const existingProduct = user.cartData.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingProduct) {
       existingProduct.quantity += 1;
    } else {
      user.cartData.push({ productId, quantity: 1, price, size });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
  
  }
};



const getCart = async (req, res) => {

  const {userId}=req.body;

  try {
   
    const user = await userModel.findById(userId).populate({
      path: 'cartData.productId',
      select: 'image name',
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }


    return res.status(200).json({
      success: true,
      cartData: user.cartData,
    });
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
     
  }
};



const updateCart = async (req, res) => {
 
  const { userId, cartId, quantity } = req.body;

  try {
   
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let cartItem = user.cartData.id(cartId)
    

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

  
    cartItem.quantity = quantity;
    
    await user.save();

    return res.status(200).json({success:true, message: 'Cart updated successfully', cart: user.cartData });
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
    
  }

};




const cartCount = async (req, res) => {
  
  const {userId}=req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const productCount = user.cartData.length;

    return res.status(200).json({
      success: true,
      productCount,
    });
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
   
  }
};


const deleteCart=async(req,res)=>{
  const {userId,cartId}=req.body;
  try {
     const user=await userModel.findById(userId)
     if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartItem = user.cartData.id(cartId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

     await userModel.findByIdAndUpdate(
      userId,
      { $pull: { cartData: { _id: cartId } } },
      { new: true }  
    );

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
    });


    
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
    
  }
};




const gettotalAmount=async(req,res)=>{

  const {userId}=req.body;
  try {

    const user= await userModel.findById(userId).populate('cartData.productId')

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    let totalAmount = 0;
    let subtotal = 0;     

    user.cartData.forEach((cartItem) => {
      const product = cartItem.productId;
      if (product) {
        const productAmount = product.price * cartItem.quantity; 
        subtotal += productAmount;
        const shippingCharge = 60 * cartItem.quantity; 
        totalAmount += productAmount + shippingCharge; 
      }
    });

    return res.status(200).json({
      success: true,
      subtotal,  
      totalAmount,   
    });
    
  } catch (error) {
    console.error(error);
    return res.json({success:false,message:error.message})
  }
}



export {
  loginUser,
  registerUser,
  addtoCart,
  getCart,
  updateCart,
  cartCount,
  deleteCart,
  gettotalAmount
};
