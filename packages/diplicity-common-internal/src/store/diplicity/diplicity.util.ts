import { ApiResponse, ListApiResponse } from "../types";

export const extractProperties = <T>(response: ApiResponse<T>) =>
  response.Properties;

export const extractPropertiesList = <T>(response: ListApiResponse<T>) => {
  return response.Properties.map((response) => response.Properties);
};
