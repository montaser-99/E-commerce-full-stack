import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import { Createproduct, DeleteProduct, Getproductbycategory, GetProductByCategoryAndSubCategory, GetproductbyId, Getproducts, searchProduct, UpdateProduct } from "../controllers/product.controller.js";

const productRouter=Router()
productRouter.post("/add-product",auth, authorizeRoles("Admin"),Createproduct)
productRouter.post("/get-all",Getproducts)
productRouter.post("/search", searchProduct);
productRouter.post("/get-product-bycategory",Getproductbycategory)
productRouter.post("/get-product-bycategory-and-subcategory",GetProductByCategoryAndSubCategory)
productRouter.post("/get-product-details",GetproductbyId)
productRouter.put("/update",auth, authorizeRoles("Admin"),UpdateProduct)
productRouter.delete("/delete",auth, authorizeRoles("Admin"),DeleteProduct)


export default productRouter