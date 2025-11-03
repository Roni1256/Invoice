import axios from "axios"
const BASE_URL = import.meta.env.VITE_NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://smart-billing-server.vercel.app/api'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:"include"
  })