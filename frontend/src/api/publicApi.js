import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/public`;

const postJson = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
};

export const sendContactMessage = (payload) => postJson("/contact", payload);
export const subscribeNewsletter = (payload) => postJson("/newsletter", payload);