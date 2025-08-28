import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { UploadImageController } from "../controllers/Uploadimage.controller.js";
import { upload } from "../middlewares/multer.js";

const uploadRouter = Router();

uploadRouter.post(
  "/upload-image",
  auth,
  (req, res, next) => {
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
    
      upload.single("image")(req, res, next);
    } else {
  
      next();
    }
  },
  UploadImageController
);

export default uploadRouter;
