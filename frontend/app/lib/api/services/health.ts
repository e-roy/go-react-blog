import { apiClient } from "../client";
import type { HealthStatus } from "@/types";

// Simple health check function
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get("/health");
    return response.status === 200;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};

// Enhanced health check with detailed status
export const getBackendStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await apiClient.get("/health");
    return {
      isHealthy: true,
      status: response.status,
      message: response.data.message || "Backend is healthy",
      timestamp: response.data.timestamp || new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      isHealthy: false,
      status: error.response?.status || "No Response",
      message: error.message || "Backend is not responding",
      timestamp: new Date().toISOString(),
    };
  }
};
