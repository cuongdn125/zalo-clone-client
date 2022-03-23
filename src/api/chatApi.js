const { chatActions } = require("features/home/components/ChatSlice");
const { default: axiosClient } = require("./axiosClient");

const chatApi = {
  getListConversation: async (dispatch) => {
    try {
      dispatch(chatActions.getConversations());
      const res = await axiosClient.get("/conversation");
      dispatch(chatActions.getConversationsSuccess(res.data));
    } catch (e) {
      dispatch(chatActions.getConversationsFailed(e.response));
      throw new Error(e.response);
    }
  },
};

module.exports = {
  chatApi,
};
