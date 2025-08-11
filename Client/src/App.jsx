import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Header from './components/Header'
import { fetchuserDetails } from './Utils/fetchuserdetails'
import { getuserinfo } from './store/userdetailsSlice'
import { Toaster } from 'react-hot-toast'
import { setAllcategories } from './store/productSlice';
import { setAllsubcategories } from './store/productSlice';
import { Axios } from './Utils/Axios';
import { SummaryApi } from './common/SummaryApi';
import { fetchCartItem } from './store/cartSlice'
import { handleAddAddress } from './store/addressSlice';
import { setAllAddresses } from './store/addressSlice';




import './App.css';


function App() {
    const dispatch = useDispatch()
    const fetchCategories = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.getallcategory.url,
                method: SummaryApi.getallcategory.method,
            })
            // console.log("All Categories from API:", response.data.data);


            dispatch(setAllcategories(response.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchsubCategories = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.Getsubcategories.url,
                method: SummaryApi.Getsubcategories.method,
            })

            dispatch(setAllsubcategories(response.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUser = async () => {
        try {
            const userData = await fetchuserDetails()
            if (userData?.data?.user) {
                dispatch(getuserinfo(userData.data.user));
            }
            console.log(" userData from API:", userData);
        } catch (err) {
            console.log("User not logged in or error fetching")
        }
    }
    const fetchAddress = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.GetAddress.url,
                method: SummaryApi.GetAddress.method,
            });

            if (response?.data?.data) {
                dispatch(setAllAddresses(response.data.data));
            }
        } catch (error) {
            console.log("Error fetching address", error);
        }
    };
    useEffect(() => {
        fetchUser()
        fetchCategories()
        fetchsubCategories()
        dispatch(fetchCartItem())
        fetchAddress();
    }, [])

    return (
        <>
            <Header />
            <main className='min-h-[78vh]'>
                <Outlet />
            </main>

            <Toaster />
        </>

    )
}

export default App

