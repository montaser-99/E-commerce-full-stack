import axios from "axios";
import { dbUrl } from "../common/SummaryApi";
import { SummaryApi } from "../common/SummaryApi";
import store from "../store/store"; // استدعاء الـ store عشان نجيب منه حالة اليوزر

export const Axios = axios.create({
  baseURL: dbUrl,
  withCredentials: true,
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    const { userinfo } = store.getState().user;
    if (!userinfo) {
      return Promise.reject(error); 
    }

    if (
      error.response?.data?.message === "Unauthorized" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        
        await Axios({ ...SummaryApi.refreshToken });

    
        return Axios(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
