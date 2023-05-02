import { create } from "apisauce";
import cache from "../utils/cache";
import authStorage from "../auth/storage";
import { Alert } from "react-native";

export const DEBUG = false;

export const site = DEBUG
  ? "http://127.0.0.1:8000/"
  : "https://forest--house-api.ru/";

const client = create({
  baseURL: `${site}`,
});


const refresh = async () => {
  const refresh = await authStorage.getRefreshToken();
  return client.post("auth/jwt/refresh/", { refresh });
};

client.axiosInstance.interceptors.request.use(
  async (config) => {
    const authToken = await authStorage.getToken();
    if (authToken) {
      // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      config.headers["Authorization"] = `JWT ${authToken}`; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
      if (err.response && err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await refresh();
          if (rs.ok) {
            const { access } = rs.data;
            await authStorage.setToken(access);
            return client.axiosInstance(originalConfig);
          }
          Alert.alert(
            "Ошибка авторизации",
            "Срок действия ключа истёк. Требуется авторизация."
          );
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    return Promise.reject(err);
  }
);

const get = client.get;
client.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default client;
