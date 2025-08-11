
import { sendEmail } from "../config/sendEmail.js"
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js"
import generateAccessToken from "../utils/generatedAccessToken.js"
import generateRefreshToken from "../utils/generatedRefreshToken.js"
import { verifyemailtemplate } from "../utils/verifyEmailtemplate.js"
import uploadImageClodinary from "../utils/uoloadimage.js";
import { generate_Otp } from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotpasswordtemplate.js";
import jwt from "jsonwebtoken"




export const Registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "provide email, name, password", error: true, success: false })
    }
    const user = await User.findOne({ email })
    if (!user) { return res.status(400).json({ message: "this email already exist", error: true, success: false }) }
    const user_data = {
      name,
      email,
      password
    }
    const newuser = new User(user_data)
    const saveduser = await newuser.save()

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${saveduser?._id}`

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Montaser E-Commerce",
      html: verifyemailtemplate({
        name,
        url: VerifyEmailUrl
      })
    })
    return res.status(200).json({ message: "user register successfully check your email to verify", error: false, success: true })
  }
  catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// ///////////
export const verifyEmailcontroller = async (req, res) => {
  try {
    console.log("verify-email body:", req.body);
    const { code } = req.body;
    // console.log("BODY RECEIVED:", req.body); 


    const updatedUser = await User.findByIdAndUpdate(
      code,
      { verify_email: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    return res.json({
      message: "Verify email done",
      success: true,
      error: false
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}
////////
export const Logincontroller = async (req, res, next) => {

  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(404).json({ message: "you must provide email and password", success: false, error: true });
    }
    const user = await User.findOne({ email })
    if (!user) { return res.status(404).json({ message: "email or password incorrect", success: false, error: true }); }
    if (!user.verify_email) {
      return res.status(403).json({ message: "Please verify your email first", success: false, error: true });
    }
    if (user.status !== "Active") { return res.status(404).json({ message: "contact Admin", success: false, error: true }); }
    const checkedpassword = await bcrypt.compare(password, user.password)
    if (!checkedpassword) { return res.status(404).json({ message: "email or password incorrect", success: false, error: true }); }

    const access_token = generateAccessToken(user)
    const refresh_token = await generateRefreshToken(user._id)

    const updateUser = await User.findByIdAndUpdate(user?._id, {
      last_login_date: new Date()
    })

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"

    }
    res.cookie("accessToken", access_token, {
      ...cookieOption, maxAge: 60 * 60 * 1000

    })
    res.cookie("refreshToken", refresh_token, { ...cookieOption, maxAge: 7 * 24 * 60 * 60 * 1000 })
    return res.json({
      message: "Login successfully",
      error: false,
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }



}
// ///////////////////////////

export const Logoutcontroller = async (req, res) => {
  try {
    const userid = req.userid
    await User.updateOne(
      { _id: userid },
      { $unset: { refresh_token: 1 } } 
    );

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"

    }
    res.clearCookie("accessToken", cookieOption)
    res.clearCookie("refreshToken", cookieOption)
    return res.json({
      message: "Logout successfully",
      success: true,
      error: false
    });


  }
  catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }

}


// /////////////////////////////////////
export const uploadavatar = async (req, res, next) => {
  try {
    const userId = req.userid;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
        success: false,
        error: true
      });
    }

    const image = req.file;
    if (!image) {
      return res.status(400).json({
        message: "No image uploaded.",
        success: false,
        error: true
      });
    }

    const upload = await uploadImageClodinary(image);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { avatar: upload.url },
      { new: true }
    );

    return res.json({
      message: "Profile picture updated successfully.",
      success: true,
      error: false,
      data: updateUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};


export const updatuserdetails = async (req, res, next) => {
  try {
    const userId = req.userid;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID is missing.",
        success: false,
        error: true
      });
    }

    const { name, mobile, email, password } = req.body;

    if (password) {
      return res.status(400).json({
        message: "Use the change-password route to update password.",
        success: false,
        error: true
      });
    }

    if (!name && !email && !mobile) {
      return res.status(400).json({
        message: "No update data provided.",
        success: false,
        error: true
      });
    }

    let updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(mobile && { mobile }),
      },
      { new: true }
    );

    if (!updatedUser) {
      updatedUser = await User.findById(userId);
    }

    return res.json({
      message: "User details updated successfully.",
      success: true,
      error: false,
      data: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true
    });
  }
};


// /////////////////
export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({
        message: "user not found ",
        error: true,
        success: false,
      });
    }
    const otp = generate_Otp()
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);
    const update = await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString()
    })

    const Otp_email = await sendEmail({
      sendTo: email,
      subject: "code to reset password from Montaser E-Commerce",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    })
    return res.status(200).json({ message: "code sent to your email", error: false, success: true })

  }
  catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// /////////

export const verifyforgotpasswordotp = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required field email, otp.",
        error: true,
        success: false
      })
    }
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false
      })
    }

    const currentTime = new Date().toISOString()

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false
      })
    }
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false
      })
    }
    const updateUser = await User.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: ""
    })

    return res.json({
      message: "Verify otp successfully",
      error: false,
      success: true
    })
  }
  catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
// ////////////////////////////////////

export const resetpassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields: email, newPassword, confirmPassword",
        error: true,
        success: false
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not available",
        error: true,
        success: false
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword must be the same.",
        error: true,
        success: false
      });
    }

    user.password = newPassword;
    await user.save();


    return res.status(200).json({
      message: "Password updated successfully.",
      error: false,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};
// //////////////////////////////////////
export const refreshToken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

    if (!refreshtoken) {
      return res.status(401).json({
        message: "No refresh token provided",
        error: true,
        success: false
      });
    }

    let verifytoken;
    try {
      verifytoken = jwt.verify(refreshtoken, process.env.REFRESHTOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        error: true,
        success: false
      });
    }

    const user = await User.findById(verifytoken.id);


    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }
    if (user.refresh_token !== refreshtoken) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    const newAccessToken = generateAccessToken(user);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    };

    res.cookie('accessToken', newAccessToken, { ...cookiesOption, maxAge: 60 * 60 * 1000 });

    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,

    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};

// /////Get login user details 
export const userDetails = async (req, res, next) => {
  try {
    const userId = req.userid
    const user = await User.findById(userId).select(`-password -refresh_token`)
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    return res.json({
      message: "user details",
      error: false,
      success: true,
      data: {
        user
      }
    })



  }
  catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }


} 