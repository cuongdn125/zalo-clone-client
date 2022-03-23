import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "app/globalSlice";
import chatReducer from "features/home/components/ChatSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    chat: chatReducer,
  },
});
