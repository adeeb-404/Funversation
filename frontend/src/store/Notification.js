import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
