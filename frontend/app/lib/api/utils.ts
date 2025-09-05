import type { ApiResponse } from "@/types";

/**
 * Extracts data from API response, handling the double data key pattern
 * Backend returns: { message: string, timestamp: string, data: T }
 * So we need to access response.data.data
 */
const extractData = <T>(response: { data: ApiResponse<T> }): T => {
  if (!response.data.data) {
    throw new Error("No data returned from API");
  }
  return response.data.data;
};

/**
 * Extracts data from API response for arrays, with fallback to empty array
 */
const extractDataArray = <T>(response: { data: ApiResponse<T[]> }): T[] => {
  return response.data.data || [];
};

/**
 * Type guard to check if response has data
 */
const hasData = <T>(response: {
  data: ApiResponse<T>;
}): response is { data: ApiResponse<T> & { data: T } } => {
  return response.data.data !== undefined && response.data.data !== null;
};

export { extractData, extractDataArray, hasData };
