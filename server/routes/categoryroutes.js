import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { AddCategory, deleteCategory, GetAllCategories, updateCategory } from "../controllers/category.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
const categoryRouter = Router()





categoryRouter.post("/add", auth, authorizeRoles("Admin"), AddCategory)
categoryRouter.get("/",GetAllCategories)
categoryRouter.put("/update-category", auth, authorizeRoles("Admin"), updateCategory)
categoryRouter.delete('/delete-category/:id', auth, authorizeRoles("Admin"), deleteCategory);





export default categoryRouter 