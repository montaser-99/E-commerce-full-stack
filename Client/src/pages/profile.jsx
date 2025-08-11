
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import isAdmin from '../Utils/isAdmin';
import { Axios } from "../Utils/Axios";
import { SummaryApi } from "../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import  {deluserinfo} from "../store/userdetailsSlice"
function Profile() {
    const user = useSelector((state => state?.user?.userinfo))
    const navigate=useNavigate()
      const dispatch = useDispatch();
    const handleLogout=async()=>{
        try {
            const response=await Axios({
                ...SummaryApi.logout
            })
            if (response.success){
                dispatch(deluserinfo())
                toast.success("Logout Successfully")
                navigate("/login")
            }
        } catch (error) {
            
        }
    }
    return (
        <>
            <div className="container-fluid px-2">
                <div className="row flex-column flex-md-row min-vh-100 gap-3">

                    {/* Sidebar */}
                    <div
                        className="col-12 col-md-2 bg-light rounded p-3"
                        style={{ minHeight: "200px" }}
                    >
                        {user && isAdmin(user.role) && (
                            <>
                                <NavLink to="product" className="btn btn-outline-primary w-100 my-2">Products</NavLink>
                                <NavLink to="upload-product" className="btn btn-outline-primary w-100 my-2">Upload Product</NavLink>
                                <NavLink to="category" className="btn btn-outline-primary w-100 my-2">Categories</NavLink>
                                <NavLink to="sub-category" className="btn btn-outline-primary w-100 my-2">Sub Categories</NavLink>
                            </>
                        )}
                        <NavLink to="my-profile" className="btn btn-outline-primary w-100 my-2">My Profile</NavLink>
                        <NavLink to="my-orders" className="btn btn-outline-primary w-100 my-2">My Orders</NavLink>
                        <NavLink to="my-address" className="btn btn-outline-primary w-100 my-2">My Address</NavLink>
                        <NavLink className="btn btn-outline-danger w-100 my-2" onClick={handleLogout}>Logout</NavLink>
                    </div>

                    {/* Content Area */}
                    <div className="col-12 col-md-9 bg-white rounded shadow-sm p-3 flex-grow-1">
                        <Outlet />
                    </div>

                </div>
            </div>

        </>
    );
}

export default Profile;
