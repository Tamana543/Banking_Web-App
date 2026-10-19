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
export const getAllLoans = async (status) => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${API_URL}/loans${query}`, {
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

const reviewLoan = async (id, action) => {
  const response = await fetch(`${API_URL}/loans/${id}/${action}`, {
    method: "PATCH",
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

export const getAllTransactions = async ({ page = 1, type = "", status = "" } = {}) => {
  const params = new URLSearchParams({ page });
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  const response = await fetch(`${API_URL}/transactions?${params}`, {
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
const userAction = async (id, action) => {
  const response = await fetch(`${API_URL}/users/${id}/${action}`, {
    method: "PATCH",
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

export const suspendUser = (id) => userAction(id, "suspend");
export const reactivateUser = (id) => userAction(id, "reactivate");
export const unlockUser = (id) => userAction(id, "unlock");
export const approveLoan = (id) => reviewLoan(id, "approve");
export const rejectLoan = (id) => reviewLoan(id, "reject");