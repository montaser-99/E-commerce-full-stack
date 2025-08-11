import { Router } from "express";
import { forgotpassword, Logincontroller, Logoutcontroller, refreshToken, Registeruser, resetpassword, updatuserdetails, uploadavatar, userDetails, verifyEmailcontroller, verifyforgotpasswordotp } from "../controllers/usercontroller.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
const userRouter=Router()



userRouter.post('/register',Registeruser)
userRouter.post('/verify-email',verifyEmailcontroller)
userRouter.post('/login',Logincontroller)
userRouter.post('/logout',auth,Logoutcontroller)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadavatar)
userRouter.put('/update-user',auth,updatuserdetails)
userRouter.put('/forgot-password',forgotpassword)
userRouter.put('/verify-forgot-password',verifyforgotpasswordotp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)
export default userRouter   