import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { AddToCart, Deletecartitem, Getcartitems, Updatecartitem } from "../controllers/cart.controller.js";
const CartRouter = Router()


CartRouter.post('/add',auth,AddToCart)
CartRouter.get('/get',auth,Getcartitems)
CartRouter.post('/update',auth,Updatecartitem)
CartRouter.delete('/delete',auth,Deletecartitem)



export default CartRouter