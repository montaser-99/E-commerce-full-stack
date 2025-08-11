import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userinfo: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getuserinfo: (state, action) => {
      state.userinfo = { ...action.payload }
    },
    deluserinfo: (state) => {
      state.userinfo = null
    },
    updatedAvatar: (state, action) => {
      if (state.userinfo) {
        state.userinfo.avatar = action.payload
      }
    }
  }
})

export const { getuserinfo, deluserinfo, updatedAvatar } = userSlice.actions
export default userSlice.reducer
