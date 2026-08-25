const API_URL = "http://localhost:5000/api/savings-goals";
const getToken = () => {
  return localStorage.getItem("token");
};
export const getSavingsGoals = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load savings goals.");
  }
  return data;
};
export const createSavingsGoal = async (
  name,
  targetAmount,
  deadline
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      name,
      targetAmount,
      deadline,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create savings goal.");
  }
  return data;
};