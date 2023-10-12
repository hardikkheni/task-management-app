import axios from 'axios';

const apiService = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

export const tokenKey = 'accessToken';

apiService.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(tokenKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.resolve(error);
  }
);

apiService.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data;
    const message = data?.message || err.message;
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ message, errors: data?.errors || {} });
  }
);

export default apiService;
