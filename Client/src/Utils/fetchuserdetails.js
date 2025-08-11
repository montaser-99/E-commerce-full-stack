import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useDispatch } from 'react-redux'; 
import {getuserinfo} from"../store/userdetailsSlice.js"

export const fetchuserDetails = async () => {
    try {
        const response = await Axios({
            url: SummaryApi.userdetails.url,
            method: SummaryApi.userdetails.method

        })

        return response.data
    }
    catch (error) {
        console.log(error)
    }
}
