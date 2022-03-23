const { default: axiosClient } = require("./axiosClient");

const friendApi = {
  sendInvite: async (user) => {
    try {
      const res = await axiosClient.post("/friend/sendInvite", {
        data: user,
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  acceptInvite: async (user) => {
    try {
      const res = await axiosClient.post("/friend/acceptInvite", {
        data: user,
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteFriend: async (user) => {
    try {
      const res = await axiosClient.post("/friend/deleteFriend", {
        data: user,
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  cancelInvite: async (user) => {
    try {
      const res = await axiosClient.post("/friend/cancelInvite", {
        data: user,
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default friendApi;
