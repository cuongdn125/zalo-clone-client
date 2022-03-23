const { globalActions } = require("app/globalSlice");
const { default: axiosClient } = require("./axiosClient");

const authApi = {
  login: async (user, dispatch, navigate) => {
    dispatch(globalActions.login());

    try {
      const res = await axiosClient.post("/auth/login", user);
      dispatch(globalActions.loginSuccess(res.user));
      // socket.connect();
      navigate("/");
    } catch (error) {
      dispatch(globalActions.loginFailed());
      throw new Error(error.response.data.message);
    }
  },
  register: async (user, dispatch, navigate) => {
    dispatch(globalActions.register());
    try {
      await axiosClient.post("/auth/register", user);
      //   console.log(res);
      dispatch(globalActions.registerSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(globalActions.registerFailed());
      throw new Error(error.response.data.message);
    }
  },
  refreshToken: async (dispatch, navigate) => {
    try {
      await axiosClient.post("/auth/refresh-token");
    } catch (error) {
      dispatch(globalActions.loginFailed());
      navigate("/login");
    }
  },
  logout: async (dispatch, navigate) => {
    dispatch(globalActions.logout());
    try {
      await axiosClient.post("/auth/logout");
      dispatch(globalActions.logoutSuccess());
      navigate("/login");
    } catch (error) {
      dispatch(globalActions.logoutFailed());
      throw new Error(error.response.data.status);
    }
  },
};

export default authApi;
