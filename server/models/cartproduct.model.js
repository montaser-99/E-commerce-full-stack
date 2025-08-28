
import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, "Minimum quantity is 1"],
    },
    userId: { 
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
})

const CartProduct = mongoose.model('CartProduct', cartProductSchema)

export default CartProduct