import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import { AddSubCategory, deleteSubCategory, GetAllSubCategories, UpdateSubcategory } from "../controllers/subcategory.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
const SubCategoryRouter=Router()

SubCategoryRouter.post("/add",auth,authorizeRoles("Admin"),AddSubCategory)
SubCategoryRouter.get("/",auth,authorizeRoles("Admin"),GetAllSubCategories)
SubCategoryRouter.put("/update-subcategory",auth,authorizeRoles("Admin"),UpdateSubcategory)
SubCategoryRouter.delete("/delete/:id",auth,authorizeRoles("Admin"),deleteSubCategory)


export default SubCategoryRouter   