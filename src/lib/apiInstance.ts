import axios, { AxiosError } from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // ❌ Không retry refresh token API
    if (originalRequest?.url?.includes("/users/refresh_token")) {
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    // ❌ Đã retry rồi thì dừng
    if (originalRequest._retry) {
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    // ✅ Token hết hạn
    if (error.response?.status === 401 || error.response?.status === 410) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/refresh_token`,
          {},
          { withCredentials: true },
        );

        onRefreshed();
        return apiInstance(originalRequest);
      } catch (err) {
        window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
