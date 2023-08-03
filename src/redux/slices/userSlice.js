import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user", // 추후에 프로필 사진이나 닉네임 등 추가할 수도 있으니 처음부터 객체로 관리함
  initialState: {
    email: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload;
    },
    unsetUser: (state) => {
      state.email = null;
    },
  },
});
const userReducer = user.reducer;
export const { setUser, unsetUser } = user.actions;
export default userReducer;
