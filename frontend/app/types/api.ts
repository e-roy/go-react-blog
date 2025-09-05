// Generic API response wrapper
export interface ApiResponse<T> {
  message: string;
  timestamp: string;
  data?: T;
}

// Health check types
export interface HealthStatus {
  isHealthy: boolean;
  status: number | string;
  message: string;
  timestamp: string;
  uptime?: number;
  version?: string;
}
