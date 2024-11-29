import { createSlice } from "@reduxjs/toolkit";

const initialState = { chats: [], selectedChats: false };
const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChats = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
  },
});

export const { setSelectedChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;
