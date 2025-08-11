import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  address_line: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  status: { type: Boolean, default: true },
  pincode: { type: String },
  country: { type: String },
  mobile: { type: Number },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    
  }

}, { timestamps: true })

const Address = mongoose.model("Address", addressSchema)
export default Address