import axios from "axios";
import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/api/savings-goals`;
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
export const createSavingsGoal = async ( name, targetAmount, deadline ) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        name,
        targetAmount,
        deadline: deadline || null,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to create savings goal."
    );
  }
};
export const addSavingsContribution = async ( goalId, amount, pin ) => {
  try {
    const response = await axios.post(
            `${API_BASE_URL}/api/transactions/savings-contribution`,
      {
        goalId,
        amount,
        pin,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to add savings contribution."
    );
  }
};
export const deleteSavingsGoal = async (goalId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${goalId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete savings goal."
    );
  }
};