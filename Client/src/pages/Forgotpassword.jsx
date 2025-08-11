import React, { useState } from 'react'
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";


function Forgotpassword() {
    const navigate = useNavigate();


    const [data, setData] = useState(
        {
            email: "",
        }
    )

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
        e.preventDefault()
        try {
            const response = await Axios({
                url: SummaryApi.forgotpassword.url,
                method: SummaryApi.forgotpassword.method,
                data: data,
            });
            console.log(response)
            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message);

                const emailToSend = data.email; 

                setData({
                    email: "",
                });
                console.log(emailToSend)

                navigate("/verify-otp", {
                    state: { email: emailToSend },
                });
            }}


        catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Registration failed!");
            }


        }

    return (
            <>
              
                <div className='container-fluid vh-100'>
                    <div className='row h-100'>
                        <div className='col-12 col-md-6'>
                             <img src='../assets/Forgot.svg' className='h-100 w-100' style={{objectFit:"contain"}}></img>
                        </div>
                        <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>

                            <form className='w-75 w-md-50 '>
                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Email</label>
                                    <input
                                        name='email'
                                        type="text"
                                        class="form-control"
                                        id="exampleInputPassword1"
                                        onChange={handlechange}
                                        value={data.email} />

                                </div>
                                <button disabled={!valideValue} type="submit" class="btn btn-primary w-100 my-3" onClick={handleSubmit}>Submit</button>
                                <span>Already have account ?<Link to={"/login"}>Login</Link> </span>
                            </form>



                        </div>
                    </div>
                </div>

            </>
        )
    }

    export default Forgotpassword
