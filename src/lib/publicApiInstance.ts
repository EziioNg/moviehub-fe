import axios from "axios";

import { API_ROOT } from "@/utils/constants";

// Public API instance for routes that don't require authentication
const publicApiInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default publicApiInstance;
