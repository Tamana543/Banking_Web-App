const API_URL = "http://localhost:5000/api/transactions";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getTransactions = async () => {
  const response = await fetch(API_URL, {
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

export const depositMoney = async (amount) => {
  const response = await fetch(`${API_URL}/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ amount }),
  });

  return response.json();
};

export const withdrawMoney = async (amount) => {
  const response = await fetch(`${API_URL}/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ amount }),
  });

  return response.json();
};