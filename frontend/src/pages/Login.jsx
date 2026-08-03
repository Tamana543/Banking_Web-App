import handleApiError from "../util/handleApiError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {isEmpty,isValidEmail} from "../util/validation";
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {showToast} = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(formData.email)) {
    showToast("Email is required.", "error");
    return;
    }
    if (!isValidEmail(formData.email)) {
        showToast("Please enter a valid email.", "error");
        return;
    }
    if (isEmpty(formData.password)) {
        showToast("Password is required.", "error");
        return;
    }
    try {
      const data = await loginUser(
        formData.email,
        formData.password
      );
      login(data.user, data.token);
      showToast( "Welcome back!", "success" );
      navigate("/dashboard");
    } catch (error) {
      showToast(handleApiError(error),"error")
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;