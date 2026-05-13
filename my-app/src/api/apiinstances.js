// src/api/axiosInstance.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error) => {

  failedQueue.forEach((promise) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};


api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      // already refreshing
      if (isRefreshing) {

        return new Promise((resolve, reject) => {

          failedQueue.push({
            resolve,
            reject,
          });

        }).then(() => {
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {

        // refresh access token
        await api.post("/auth/refresh");

        processQueue(null);

        // retry failed request
        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError);

        if (window.location.pathname !== "/login") {
  window.location.href = "/login";
}

        return Promise.reject(refreshError);

      } finally {

        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;