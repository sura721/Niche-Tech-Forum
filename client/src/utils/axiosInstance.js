import axios from "axios";
export const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_API_URL|| "https://niche-tech-forum.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})