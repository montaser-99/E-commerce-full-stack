import { Router } from 'express'
import {auth} from '../middlewares/auth.js'
import {UploadImageController} from '../controllers/Uploadimage.controller.js'
import {upload }from '../middlewares/multer.js'

const uploadRouter = Router()

uploadRouter.post("/upload-image",auth,upload.single("image"),UploadImageController)

export default uploadRouter   