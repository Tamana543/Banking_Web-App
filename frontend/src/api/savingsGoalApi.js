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


export const createSavingsGoal = async (
  name,
  targetAmount,
  deadline
) => {
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

export const addSavingsContribution = async (
  goalId,
  amount
) => {
  try {
    const response = await axios.post(
      `${API_URL}/${goalId}/contribute`,
      {
        amount,
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