
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await Axios({
                    url: SummaryApi.verifyEmail.url,
                    method: SummaryApi.verifyEmail.method,
                    data: { code }
                });

                if (res.data.success) {
                    toast.success("Email verified successfully!");
                    navigate("/login");
                } else {
                    toast.error(res.data.message || "Verification failed.");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Something went wrong.");
            }
        };

        if (code) {
            verifyEmail();
        }
    }, [code, navigate]);

    return (
        <div className="container m-auto  text-center">
            <h2>Verifying your email....</h2>
        </div>
    );
}

export default VerifyEmail;
