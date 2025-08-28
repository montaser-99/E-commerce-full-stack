import { Dbconnection } from "./config/mongoose.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./routes/userroutes.js";
import categoryRouter from "./routes/categoryroutes.js";
import uploadRouter from "./routes/uploadrouter.js";
import SubCategoryRouter from "./routes/subcategoryroutes.js";
import productRouter from "./routes/productroutes.js";
import CartRouter from "./routes/cartroutes.js";
import AddressRouter from "./routes/addressroutes.js";
import orderRouter from "./routes/orderroutes.js";
import { webhookStripe } from "./controllers/order.controller.js";

const app = express();

// ✅ أول حاجة CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// ✅ بعدين الباقي
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// ✅ Stripe webhook لازم يكون قبل express.json()
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookStripe
);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", SubCategoryRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", CartRouter);
app.use("/api/address", AddressRouter);
app.use("/api/order", orderRouter);

// ✅ Connect DB
Dbconnection(); 

// ✅ Listen server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
 