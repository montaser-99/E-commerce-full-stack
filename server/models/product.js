import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "you must provide category name"]
    },
    image: {
        type: Array,
        default: []
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: "Category"


    }],
    sub_category: [{
        type: mongoose.Schema.ObjectId,
        ref: "Sub_Category"


    }],
    unit: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true

})
productSchema.index(
    { name: "text", description: "text" },
    {
        weights: {
            name: 10,
            description: 5
        },
        name: "TextIndex"
    }
)












const Product = mongoose.model("Product", productSchema)
export default Product 