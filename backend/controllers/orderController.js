import ordermodel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import razorpay from "razorpay"


const deliveryCharge= 60 ;
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance= new razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET
})


const getOrderInfo= async(userId)=>{
    try {
        
        const user = await userModel.findById(userId).populate('cartData.productId'); 
    
        if (!user || !user.cartData) {
          return { error: "User or cart not found" };
        }
    
        const orderinfo = [];

        user.cartData.forEach(cartItem => {
          const product = cartItem.productId;  //populated productId
    
          if (product) {
            const iteminfo = {
              ...product.toObject(),  //takes a copy 
              size: cartItem.size,
              quantity: cartItem.quantity,
            };
    
            orderinfo.push(iteminfo);
          }
        });
    
        return orderinfo;
      } catch (error) {
        console.error("Error fetching order info:", error);
        return { error: "An error occurred" };
      }
}


const gettotalamount=async(userId)=>{

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

    return  totalAmount; 
    
}





//controlers


const placeOrder=async(req,res)=>{

    const { userId,address }=req.body;

     
    try {

         const items=await getOrderInfo(userId)
         const amount= await  gettotalamount(userId)


        const orderData={
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment: false,
            date: Date.now()
        }

        const newOrder= new ordermodel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: [] }); 

         res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}



const placeOrderStripe=async(req,res)=>{

   const { userId,address }=req.body;
   const { origin }=req.headers;

    try {
      const items=await getOrderInfo(userId)
      const amount= await  gettotalamount(userId)
      
      const orderData={
        userId,
        items,
        amount,
        address,
        paymentMethod:"Stripe",
        payment: false,
        date: Date.now()
    };

    const newOrder= new ordermodel(orderData)
    await newOrder.save()

    const line_items = items.map((item)=> ({
        price_data:{
          currency: 'inr',
          product_data:{
            name: item.name
          },
          unit_amount: item.price * 100
        },
        quantity: item.quantity
    }))

     line_items.push({
      price_data:{
        currency: 'inr',
        product_data:{
          name: 'Delivery charges'
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
     })

     const session= await stripe.checkout.sessions.create({
       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
       cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
       line_items,
       mode: 'payment'
     })

   
     res.json({
      success:true,
      session_url: session.url
     })


      
    } catch (error) {
      console.log(error);
        res.json({success:false,message:error.message})
    }
}


const verifyStripe=async(req,res)=>{

  const { orderId,success,userId}=req.body;

  try {
    if(success=== 'true'){
       await ordermodel.findByIdAndUpdate(orderId, {payment:true})
       await userModel.findByIdAndUpdate(userId, { cartData: [] }); 
       res.json({success:true})
    }else{
      await ordermodel.findByIdAndDelete(orderId)
      res.json({success:false})
    }
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}



const placeOrderRazorpay=async(req,res)=>{

  const { userId,address }=req.body;
  

   try {
     const items=await getOrderInfo(userId)
     const amount= await  gettotalamount(userId)
     
     const orderData={
       userId,
       items,
       amount,
       address,
       paymentMethod:"Razorpay",
       payment: false,
       date: Date.now()
   };

   const newOrder= new ordermodel(orderData)
   await newOrder.save()

   
   const options={
      amount: amount * 100,
      currency: 'INR',
      receipt : newOrder._id.toString()
   }

      await razorpayInstance.orders.create(options, (err, order)=>{
      if(err){
        console.log(err);
        return res.json({success: false, message: err})
      }

      res.json({success:true, order})
   })

      
    } catch (error) {
      console.log(error);
      res.json({success:false,message:error.message})
    }
   
}


const verifyRazorpay=async(req,res)=>{

  const { userId, razorpay_order_id }=req.body;

  try {

    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
    if(orderInfo.status === 'paid'){
       await ordermodel.findByIdAndUpdate(orderInfo.receipt,{
        payment: true
       });
       await userModel.findByIdAndUpdate(userId, { cartData: [] }); 
       
       res.json({success:true,message:'payment successfull'})
    }else{
      res.json({success:false,message:'payment failed!'})

    }
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}




const allOrders=async(req,res)=>{
  try {
    
    const orders=await ordermodel.find({})
    return res.json({success:true,orders})

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
}


const usersOrders=async(req,res)=>{
 
    const { userId }=req.body;

   try {

       const orders=await ordermodel.find({userId})
        return res.json({
          success:true,
          orders
        })
    
   } catch (error) {
     console.log(error);
     res.json({success:false,message: error.message})
     
   }

}



const updatestatus =async(req,res)=>{
   try {
       const { orderId,status }=req.body;
       await ordermodel.findByIdAndUpdate(orderId,{
         status
       });

       res.json({success:true,message:"status updated.."})
    
   } catch (error) {
    console.log(error);
    res.json({success:false,message: error.message})
   }
}



export { 
   placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,usersOrders,
  updatestatus,
  verifyStripe,
  verifyRazorpay
}