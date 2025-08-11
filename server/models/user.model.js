
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "you must provide name"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "you must provide email"],
        validate(val) {
            if (!isEmail(val)) { throw new Error("emai is invalid") }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "password should be 8 characters at least"],
        validate(val) {
            const password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
            if (!password.test(val)) { throw new Error("password should be capital,small ,numbers and special characters") }

        }
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: ""
    },
    refresh_token: {
        type: String,
        default: null

    },
    verify_email: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Address'
        }
    ],

    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Order'
        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },



}, { timestamps: true })




userSchema.pre("save", async function () {
    const user=this
    if (!this.isModified("password")) return;
    const hashedPassword = await bcrypt.hash(this.password, 8);
    this.password = hashedPassword;
});




const User = mongoose.model('User', userSchema)

export default User