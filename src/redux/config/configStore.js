import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../slices/todosSlice";
import userReducer from "../slices/userSlice";
const store = configureStore({
  reducer: {
    할일들: todosReducer, //todosSlice 리듀서를 할일들로 등록
    user: userReducer,
  },
});
export default store;
