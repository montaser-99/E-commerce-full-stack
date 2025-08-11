
import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState: initialValue,
reducers: {
  handleAddAddress: (state, action) => {
    state.addressList.push(action.payload);
  },
  setAllAddresses: (state, action) => {
    state.addressList = action.payload;
  }
}
});

export const { handleAddAddress,setAllAddresses  } = addressSlice.actions;

export default addressSlice.reducer;
