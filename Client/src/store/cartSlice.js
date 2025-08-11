import { createSlice } from '@reduxjs/toolkit'
import { Axios } from '../Utils/Axios'
import { SummaryApi } from '../common/SummaryApi'

const initialState = {
   cart: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload]
        }
    }
})

export const { handleAddItemCart } = cartSlice.actions


export const fetchCartItem = () => async (dispatch) => {
    try {
        const { data } = await Axios(SummaryApi.GetCart)
        if (data.success) {
            dispatch(handleAddItemCart(data.data))
        }
    } catch (err) {
        console.log("error fetching cart", err)
    }
}

export default cartSlice.reducer
 