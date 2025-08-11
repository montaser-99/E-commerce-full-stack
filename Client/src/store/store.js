import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userdetailsSlice';
import productReducer from './productSlice'; 
import cartReducer from './cartSlice'
import addressReducer from './addressSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart:cartReducer,
    address: addressReducer,
  }
})
export default store