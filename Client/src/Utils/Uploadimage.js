import React from 'react'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';

const Uploadimage = async (image) => {
    try {
        const formData = new FormData()
        formData.append("image", image)
        const response = await Axios({
            url: SummaryApi.Uploadimage.url,
            method: SummaryApi.Uploadimage.method,
            data: formData
        })
        return response

    }
    catch (error) { 
        return error
    }
}
export default Uploadimage