const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
  console.log("Registration response:", data);
  alert(JSON.stringify(data, null, 2));
  throw new Error(data.message || "Registration failed");
}
  return data;
};

export const getCurrentUser = async () => {
  const token =
    localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch(
        "http://localhost:5000/api/auth/avatar",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};
