import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
  // validateStatus: function (status) {
  //   return (status >= 200 && status < 300) || (status >= 400 && status < 500); // default
  // },
  // validateStatus: () => true,
});
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 && !originalConfig.__isRetryRequest) {
      originalConfig.__isRetryRequest = true;
      try {
        await axiosClient.post("auth/refresh-token");
        return axiosClient(originalConfig);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
