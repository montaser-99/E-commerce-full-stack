import React, { useState } from 'react'
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useLocation } from 'react-router-dom';



function Setpassword() {
    const navigate = useNavigate();
    const location = useLocation();


    const [data, setData] = useState(
        {

            newPassword: "",
            confirmPassword: ""


        }
    )
    const [showpassword, setShowpassword] = useState(false)
    const [showconfirmpassword, setShowconfirmpassword] = useState(false)

    const handlechange = (e) => {
        const { name, value } = e.target
        setData(
            (oldData) => {
                return {
                    ...oldData,
                    [name]: value



                }
                // console.log(data)

            }
        )
        // console.log(data)

    }

    const valideValue = Object.values(data).every(el => el)



    const handleSubmit = async (e) => {

        const email = location?.state?.email;
        console.log(email)

        if (!email) {
            toast.error("Email not found. Please restart the reset process.");
            return;
        }

        e.preventDefault()
        if (data.newPassword !== data.confirmPassword) {
            toast.error("password and confirmed password must be same")
            return
        }

        try {
            console.log("Submitting:", {
                email,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            const response = await Axios({
                url: SummaryApi.resetpassword.url,
                method: SummaryApi.resetpassword.method,
                data: {
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword,
                    email: location?.state?.email
                },
            });
            console.log(response)
            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    newPassword: "",
                    confirmPassword: ""
                })
                navigate("/login", { state: { email: data.email } })
            }
        }


        catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed!");
        }


    }

    return (
        <>
        
            <div className='container-fluid vh-100'>
                <div className='row h-100'>
                    <div className='col-12 col-md-6'> <img src='../assets/reset.svg' className='h-100 w-100'></img>
                    </div>
                    <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>

                        <form className=' w-75 w-md-50' onSubmit={handleSubmit}>

                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <div className='d-flex'>
                                    <input
                                        name='newPassword'
                                        type={showpassword ? "text" : "password"}
                                        class="form-control"
                                        id="new"
                                        onChange={handlechange}
                                        value={data.newPassword} />
                                    <div onClick={() => setShowpassword(!showpassword)} className='mx-3'>
                                        {showpassword ? <FaEye size={23} /> : <IoMdEyeOff size={23} />}
                                    </div>
                                </div>

                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">confirm Password</label>
                                <div className='d-flex'>
                                    <input
                                        name='confirmPassword'
                                        type={showconfirmpassword ? "text" : "password"}
                                        class="form-control"
                                        id="confirmpassword"
                                        onChange={handlechange}
                                        value={data.confirmPassword} />
                                    <div onClick={() => setShowconfirmpassword(!showconfirmpassword)} className='mx-3'>
                                        {showconfirmpassword ? <FaEye size={23} /> : <IoMdEyeOff size={23} />}
                                    </div>

                                </div>

                            </div>
                            <button disabled={!valideValue} type="submit" class="btn btn-primary w-100 my-3" >Change password</button>
                            <span>Already have account ?<Link to={"/login"}>Login</Link> </span>
                        </form>



                    </div>
                </div>
            </div>

        </>
    )
}

export default Setpassword
