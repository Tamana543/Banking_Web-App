import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/api/admin`;
const getToken = () => localStorage.getItem("token");
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users?limit=100`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};