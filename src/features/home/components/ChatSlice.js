import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getConversations(state) {
      state.loading = true;
    },
    getConversationsSuccess(state, action) {
      state.loading = false;
      state.conversations = action.payload;
    },
    getConversationsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

//Actions
export const chatActions = chatSlice.actions;
//Selector
export const selectConversations = (state) => state.chat.conversations;
export const selectLoading = (state) => state.chat.loading;
export const selectError = (state) => state.chat.error;
//Reducer
const chatReducer = chatSlice.reducer;
export default chatReducer;
