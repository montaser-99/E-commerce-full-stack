import mongoose from "mongoose";


const sub_category_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide sub_category name"],
    },
    image: {
      type: String,
      default: "",
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "You must provide parent category ID"],
    }],
  },
  { timestamps: true }
);

const Sub_Category = mongoose.model("Sub_Category", sub_category_Schema);

export default Sub_Category; 
