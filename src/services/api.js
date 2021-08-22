import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://mistock-ms.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
