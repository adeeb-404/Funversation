import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./User.js";
import chatSlice from "./Chat.js";
import notificationSlice from "./Notification.js";

const rootReducer = combineReducers({
  user: userSlice,
  chat: chatSlice,
  notification: notificationSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
