import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    Allcategories: [],
    Allsubcategories: [],
    Allproducts: [],
    loadingcategory:false,
}


const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setAllcategories: (state, action) => { state.Allcategories = [...action.payload] },
        setAllsubcategories: (state, action) => { state.Allsubcategories = [...action.payload] },
        setAllproducts: (state, action) => { state.Allproducts = [...action.payload] },
        setloadingcategory: (state, action) => { state.loadingcategory = action.payload }
    }

})


export const {setAllcategories,setAllproducts,setAllsubcategories,setloadingcategory }=productSlice.actions
export default productSlice.reducer