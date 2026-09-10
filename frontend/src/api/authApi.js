const API_URL = "http://localhost:5000/api/auth";
const getToken = () =>
  localStorage.getItem("token");
const parseResponse = async (response,fallbackMessage) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || fallbackMessage
    );
  }
  return data;
};
export const loginUser = async ( email, password ) => {
    const response = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    return parseResponse(
      response,
      "Login failed."
    );
};
export const registerUser = async ( userData ) => {
  const response = await fetch( `${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(userData),
    }
  );
  return parseResponse(
    response,
    "Registration failed."
  );
};
export const getCurrentUser = async () => {
    const response = await fetch(
      `${API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return parseResponse(
      response,
      "Unable to retrieve user information."
    );
  };
export const uploadAvatar = async (
  file
) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await fetch(
    `${API_URL}/avatar`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }
  );
  return parseResponse(
    response,
    "Unable to upload avatar."
  );
};
export const updateProfile = async (
  profileData
) => {
  const response = await fetch(
    `${API_URL}/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(
        profileData
      ),
    }
  );
  return parseResponse(
    response,
    "Unable to update profile."
  );
};
export const changePassword = async ( passwordData ) => {
  const response = await fetch(
    `${API_URL}/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(
        passwordData
      ),
    }
  );
  return parseResponse(
    response,
    "Unable to change password."
  );
};
export const changePin = async ( pinData ) => {
  const response = await fetch(
    `${API_URL}/change-pin`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, },
      body: JSON.stringify(pinData),
    }
  );
  return parseResponse( response, "Unable to change PIN." );
};