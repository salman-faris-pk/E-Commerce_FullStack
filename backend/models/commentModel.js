import mongoose from "mongoose"




const CommentSchema= new mongoose.Schema({
    username:{
        type: String,
        required:true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required:true
    },
    comment:{
        type: String,
        required: true
    }
})

const commentmodel= mongoose.models.comment || mongoose.model('comment',CommentSchema)


export default commentmodel