import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ferti-rice.vercel.app/api",
  // withCredentials: true,
});