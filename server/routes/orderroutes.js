import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { CashOnDeliveryOrder, getUserOrders, Onlinepayment } from "../controllers/order.controller.js";

const orderRouter=Router()
orderRouter.post("/cash",auth,CashOnDeliveryOrder)
orderRouter.get("/my-orders",auth,getUserOrders)
orderRouter.post('/online-payment', auth, Onlinepayment);
// orderRouter.post('/webhook',webhookStripe)


export default orderRouter  