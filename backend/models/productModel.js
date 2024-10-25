import mongoose from "mongoose";


const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type: Array,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    sizes:{
        type: Array,
        required:true
    },
    bestseller:{
        type: Boolean
    },
  
},{
    timestamps:true
})


productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 1, category: 1, subCategory: 1, price: 1 });



const productModel= mongoose.models.product || mongoose.model("product",productSchema)


export default productModel