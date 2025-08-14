import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        index: true
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    subCategory: {
        type: String,
        required: true,
        index: true
    },
    sizes: {
        type: [String],
        required: true
    },
    bestseller: {
        type: Boolean,
        index: true
    },
}, {
    timestamps: true
});

productSchema.index({ 
    name: 'text', 
    description: 'text' 
});

productSchema.index({ 
    category: 1, 
    subCategory: 1, 
    price: 1 
});

productSchema.index({ 
    category: 1, 
    subCategory: 1, 
    name: 'text' 
});

productSchema.index({ createdAt: -1 });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;