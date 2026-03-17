import axiosBase, { type AxiosError, type AxiosInstance } from 'axios';
import { CONFIG } from 'src/config';
import { Session } from 'src/utils/session';

function createAxiosInstance(): AxiosInstance {
  const instance = axiosBase.create({
    baseURL: CONFIG.serverUrl,
  });

  instance.interceptors.request.use((config) => {
    if (Session.isAuthenticated()) {
      config.headers.Authorization = Session.getSessionToken();
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const path = window.location.pathname;
      const status = error?.response?.status;

      if (status === 401 && path !== CONFIG.auth.signInPath) {
        Session.logout();
        window.location.href = CONFIG.auth.signInPath;
      }

      return Promise.reject(
        (error.response && error.response.data) || 'Something went wrong!',
      );
    },
  );

  return instance;
}

export const axios = createAxiosInstance();
