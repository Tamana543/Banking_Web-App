import { API_BASE_URL } from "../config";
const API_URL = `${API_BASE_URL}/api/admin`;
const getToken = () => localStorage.getItem("token");
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

export const getUserDetails = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
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
export const getPlatformStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
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

export const getPlatformAnalytics = async (days = 30) => {
  const response = await fetch(`${API_URL}/analytics?days=${days}`, {
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
export const getAuditLogs = async ({ page = 1, action = "" } = {}) => {
  const params = new URLSearchParams({ page });
  if (action) params.set("action", action);
  const response = await fetch(`${API_URL}/audit-logs?${params}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export const suspendUser = (id) => userAction(id, "suspend");
export const reactivateUser = (id) => userAction(id, "reactivate");
export const unlockUser = (id) => userAction(id, "unlock");
export const approveLoan = (id) => reviewLoan(id, "approve");
export const rejectLoan = (id) => reviewLoan(id, "reject");