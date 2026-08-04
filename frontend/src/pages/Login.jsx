import { Link } from "react-router-dom";
import handleApiError from "../util/handleApiError";
import AuthLayout from "../components/auth/AuthLayout";
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
<div className="auth-page">
    <div className="auth-left">
        <h1 className="auth-logo">
            BANKIST PRO
        </h1>
        <h2 className="auth-tagline">
            Modern Banking
            <br />
            Built For Everyone.
        </h2>
        <p className="auth-description">
            Secure digital banking with instant transfers,
            savings goals, loans, analytics, and complete
            financial control—all in one place.
        </p>
        <div className="auth-decoration">
            <div className="floating-card card-one"></div>
            <div className="floating-card card-two"></div>
            <div className="floating-circle circle-one"></div>
            <div className="floating-circle circle-two"></div>
        </div>
    </div>
    <div className="auth-right">
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <p>
                Login to continue to your account.
            </p>
           <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>
        </form>
        </div>
    </div>
</div>
);
}
export default Login;