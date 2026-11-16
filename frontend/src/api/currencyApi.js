import { API_BASE_URL } from "../config";

const getToken = () => localStorage.getItem("token");

export const getRates = async () => {
  const response = await fetch(`${API_BASE_URL}/api/currency/rates`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const updateDisplayCurrency = async (currency) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/currency`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ currency }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};