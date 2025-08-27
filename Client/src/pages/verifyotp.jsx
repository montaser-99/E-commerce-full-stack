import React, { useState, useRef } from 'react'
import Header from '../components/Header';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useNavigate } from "react-router-dom";



function Verifyotp() {
    const navigate = useNavigate();
    const location = useLocation()
    // console.log(location)
    const inputRef = useRef([])


    const [data, setData] = useState(
        ["", "", "", "", "", ""]
    )



    const valideValue = Object.values(data).every(el => el)



    const handleSubmit = async (e) => {
        console.log("Email from location.state:", location.state?.email);

        e.preventDefault()
        try {
            console.log("Email being sent:", location?.state?.email);
            // console.log("OTP being sent:", data.join(""));

            const response = await Axios({
                url: SummaryApi.verifyotp.url,
                method: SummaryApi.verifyotp.method,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            });
            console.log(response)
            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])

                navigate("/set-password",{
                    state:{
                       email: location?.state?.email
                    }
                })
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
                    <div className='col-12 col-md-6'> <img src='/assets/otp.svg' className='h-100 w-100'></img>
                    </div>
                    <div className='col-12 col-md-6 d-flex justify-content-center align-items-center'>

                        <form className=' w-75 w-md-50 '>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">code</label>
                                <div className='d-flex justify-content-between gap-2'>
                                    {
                                        data.map((ele, index) => {
                                            return (
                                                <input
                                                    key={index}
                                                    name='email'
                                                    type="text"
                                                    class="form-control"
                                                    id={`${index}`}
                                                    value={data[index]}
                                                    maxLength={1}
                                                    ref={(ref) => {
                                                        inputRef.current[index] = ref
                                                        return ref
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        // console.log("value", value)
                                                        const newData = [...data]
                                                        newData[index] = value
                                                        setData(newData)
                                                        if (value && index < 5) {
                                                            inputRef.current[index + 1]?.focus();
                                                        }

                                                        // Auto-submit if last input is filled
                                                        // if (value && index === 5) {
                                                        //     handleSubmit(new Event("submit"));
                                                        // }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        //   console.log(e.key)  Backspace
                                                        if (e.key === "Backspace" && !data[index] && index > 0) {
                                                            inputRef.current[index - 1]?.focus();
                                                        }
                                                    }}



                                                />
                                            )

                                        })
                                    }

                                </div>

                            </div>
                            <button disabled={!valideValue} type="submit" class="btn btn-primary w-100 my-3" onClick={handleSubmit}>Send code</button>

                        </form>



                    </div>
                </div>
            </div>

        </>
    )
}

export default Verifyotp
