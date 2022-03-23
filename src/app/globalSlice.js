import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  logging: false,
  currentUser: undefined,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    register(state) {
      state.logging = true;
    },
    registerSuccess(state) {
      state.logging = false;
    },
    registerFailed(state) {
      state.logging = false;
    },
    login(state) {
      state.logging = true;
    },
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
    },
    loginFailed(state) {
      state.logging = false;
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
    logout(state) {
      state.logging = true;
    },
    logoutSuccess(state) {
      state.logging = false;
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
    logoutFailed(state) {
      state.logging = false;
    },
    updateProfile(state) {
      state.logging = true;
    },
    updateProfileSuccess(state, action) {
      state.logging = false;
      state.currentUser = action.payload;
    },
    updateProfileFailed(state) {
      state.logging = false;
    },
  },
});

//Actions
export const globalActions = globalSlice.actions;
//Selector
export const selectIsLoggedIn = (state) => state.global.isLoggedIn;
export const selectCurrentUser = (state) => state.global.currentUser;
export const selectIsLogging = (state) => state.global.logging;
//Reducer
const globalReducer = globalSlice.reducer;
export default globalReducer;
