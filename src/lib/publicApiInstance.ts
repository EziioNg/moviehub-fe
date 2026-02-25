import axios from "axios";

// Public API instance for routes that don't require authentication
const publicApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default publicApiInstance;
