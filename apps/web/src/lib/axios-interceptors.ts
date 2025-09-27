import { ErrorCode } from "@fullstack-q3/contracts";
import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAxiosInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (
        config.url?.includes("/auth/sign-in") ||
        config.url?.includes("/auth/refresh-token")
      ) {
        return config;
      }

      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<{ errorCode: ErrorCode }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.data.errorCode ===
          ErrorCode.UNAUTHORIZED_SURVEYOR_ACCESS_TOKEN &&
        !originalRequest._retry
      ) {
        if (
          originalRequest.url?.includes("/auth/sign-in") ||
          originalRequest.url?.includes("/auth/refresh-token")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = sessionStorage.getItem("refreshToken");

          if (!refreshToken) {
            sessionStorage.clear();
            window.location.href = "/sign-in";
            return Promise.reject(error);
          }

          const response = await axiosInstance.post(
            "/auth/refresh-token",
            undefined,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          );

          const { accessToken } = response.data;

          sessionStorage.setItem("accessToken", accessToken);

          processQueue(null, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          sessionStorage.clear();
          window.location.href = "/sign-in";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
