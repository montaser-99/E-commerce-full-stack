import React, { useState } from 'react';
import { SummaryApi } from '../common/SummaryApi';
import { useSelector } from 'react-redux';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import { getuserinfo } from '../store/userdetailsSlice';
import { useDispatch } from 'react-redux';

function Updateuserdetails() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.userinfo);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    });

    const [file, setFile] = useState(null);

    const handlechange = (e) => {
        const { name, value } = e.target;
        setFormData((oldData) => ({
            ...oldData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (file) {
                const imageData = new FormData();
                imageData.append("avatar", file);
                await Axios({
                    ...SummaryApi.uploadAvatar
                })
            }
            await Axios({
                ...SummaryApi.updateUser,
                data: formData
            })


            const profileRes = await Axios({
                ...SummaryApi.userdetails
            })
            // console.log(profileRes)

            const updatedUser = profileRes.data.data.user;

            // console.log(updatedUser)


            dispatch(getuserinfo(updatedUser));

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };


    return (
        <>
            <div className="rounded-circle overflow-hidden bg-primary d-flex align-items-center justify-content-center mb-3" style={{ width: 100, height: 100 }}>
                {user?.avatar ? (
                    <img src={user.avatar} className="w-100 h-100 object-fit-cover" alt="profile" />
                ) : (
                    <span className="text-white">image</span>
                )}
            </div>

            <button className="btn btn-outline-secondary mb-4" data-bs-toggle="modal" data-bs-target="#editAvatarModal">
                Edit profile photo
            </button>

            <div className="modal fade" id="editAvatarModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">edit avatar</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="file" className="form-control" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
            </div>

            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" onChange={handlechange} value={formData.name} />
                </div>

                <div className="mb-3">
                    <label className="form-label">email</label>
                    <input type="email" className="form-control" name="email" onChange={handlechange} value={formData.email} />
                </div>

                <div className="mb-3">
                    <label className="form-label">mobile</label>
                    <input type="text" className="form-control" name="mobile" onChange={handlechange} value={formData.mobile} />
                </div>

                <button type="submit" className="btn btn-primary">update</button>
            </form>
        </>
    );
}

export default Updateuserdetails;
