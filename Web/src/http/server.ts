import axios from "axios";
import "server-only";

const AXIOS_CONFIG = {
  baseURL: process.env.INTERNAL_API_URL,
  timeout: 10000,
  withCredentials: true,
};

const api = axios.create(AXIOS_CONFIG);

export default api;
