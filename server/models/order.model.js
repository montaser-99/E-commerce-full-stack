import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: String,
    required: [true, "Provide orderId"],
    unique: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product"
      },
      quantity: {
        type: Number,
        default: 1
      },
      product_details: {
        name: String,
        image: [String] 
      }
    }
  ],
  paymentId: {
    type: String,
    default: ""
  },
  payment_status: {
    type: String,
    default: ""
  },
  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: 'Address'
  },
  subTotalAmt: {
    type: Number, 
    default: 0
  },
  totalAmt: {
    type: Number,
    default: 0
  },
  invoice_receipt: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const Order = mongoose.model('order', orderSchema);

export default Order;
