/**
 * API Configuration and Error Handling
 * Provides smart fallbacks and helpful error messages for API calls
 */

import axios from "axios";

// Create axios instance with smart configuration
const apiClient = axios.create({
  timeout: 30000,
  validateStatus: () => true, // Don't throw on any status code
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Ensure we're using the correct base URL
  if (!config.url?.startsWith("http")) {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    if (baseUrl && !config.url?.startsWith("/api")) {
      config.baseURL = baseUrl;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a connection error
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      console.error(`❌ Could not connect to backend at ${backendUrl}`);
      console.error(
        "Please ensure the backend server is running. Check the console logs above for setup instructions.",
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
