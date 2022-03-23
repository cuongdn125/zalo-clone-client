const { globalActions } = require("app/globalSlice");
const { default: axiosClient } = require("./axiosClient");

const meApi = {
  getProfile: async (dispatch, navigate) => {
    try {
      const res = await axiosClient.get("/me");
      dispatch(globalActions.loginSuccess(res.user));
    } catch (error) {
      dispatch(globalActions.loginFailed());
      navigate("/login");
    }
  },
  checkLogin: async (dispatch) => {
    try {
      const res = await axiosClient.get("/me");
      dispatch(globalActions.loginSuccess(res.user));
    } catch (error) {
      dispatch(globalActions.loginFailed());
    }
  },
  getInfo: async () => {
    try {
      const res = await axiosClient.get("/me");
      return res.user;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateProfile: async (user, dispatch) => {
    dispatch(globalActions.updateProfile());
    try {
      const res = await axiosClient.patch("/me", user);
      // console.log(res);
      dispatch(globalActions.updateProfileSuccess(res.user));
    } catch (error) {
      dispatch(globalActions.updateProfileFailed());
      throw new Error(error.response.data.message);
    }
  },
};

export default meApi;
