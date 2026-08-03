import handleApiError from "../util/handleApiError";
import AuthLayout from "../components/auth/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {showToast} = useToast()
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      showToast("Email is required.", "error");
      return;
    }
  if (!formData.password.trim()) {
    showToast("Password is required.", "error");
    return;
  }
    try {
      const data = await registerUser(formData);
      // Automatically log the user in after registration
      login(data.user, data.token);
      showToast( "Welcome back!", "success" );
      navigate("/dashboard");
    } catch (error) {
      showToast(handleApiError(error),"error")
    }
  };
  return (
    <AuthLayout title="Create Your Account" subtitle="Start managing your finances securely.">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
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
        <input
          type="password"
          name="pin"
          placeholder="4-digit PIN"
          value={formData.pin}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">
          Register
        </button>
      </form>
    </AuthLayout>
  );
}
export default Register;