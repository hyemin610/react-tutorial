import { createSlice } from "@reduxjs/toolkit";
import todosData from "../../db.json";

const todos = createSlice({
  name: "posts",
  initialState: todosData.posts,
  reducers: {
    addTodo: (state, action) => {
      // 새로운 할일을 추가하는 리듀서
      state.push(action.payload);
    },
    removeTodo: (state, action) => {
      // 특정 할일을 제거하는 리듀서
      return state.filter((todo) => todo.id !== action.payload);
    },
    // 특정 할일을 수정하는 리듀서
    editTodo: (state, action) => {
      const { id, title, content } = action.payload;
      return state.map((todo) =>
        todo.id === id ? { ...todo, title, content } : todo
      );
    },
  },
});

// createSlice에서 생성한 리듀서
const todosReducer = todos.reducer;
export const { addTodo, removeTodo, editTodo } = todos.actions;
export default todosReducer;
