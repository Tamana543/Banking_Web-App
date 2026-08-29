import axios from "axios";

const API_URL = "http://localhost:5000/api/savings-goals";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};
export const getSavingsGoals = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to load savings goals."
    );
  }
};