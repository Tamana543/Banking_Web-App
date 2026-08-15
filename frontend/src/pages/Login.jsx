import { Link } from "react-router-dom";
import handleApiError from "../util/handleApiError";
import AuthLayout from "../components/auth/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { isEmpty, isValidEmail } from "../util/validation";
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: "",
      password: "",
      form: "",
    };
    if (isEmpty(formData.email)) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (isEmpty(formData.password)) {
      newErrors.password = "Password is required.";
    }
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      if (newErrors.email) {
        document.getElementById("login-email")?.focus();
      } else if (newErrors.password) {
        document.getElementById("login-password")?.focus();
      }
      return;
    }
    try {
      const data = await loginUser(
        formData.email,
        formData.password
      );
      login(data.user, data.token);
      showToast(
        "Welcome back!",
        "success"
      );
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
      showToast(
        errorMessage,
        "error"
      );
    }
  };
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue to your account."
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={errors.form ? "login-form-error" : undefined}
      >
        {errors.form && (
          <div
            id="login-form-error"
            className="form-error form-error-general"
            role="alert"
          >
            {errors.form}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "login-email-error"
                : undefined
            }
          />
          {errors.email && (
            <span
              id="login-email-error"
              className="form-error"
            >
              {errors.email}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "login-password-error"
                : undefined
            }
          />
          {errors.password && (
            <span
              id="login-password-error"
              className="form-error"
            >
              {errors.password}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="auth-btn"
        >
          Login
        </button>
      </form>
      <div className="auth-footer">
        Don't have an account?{" "}
        <Link to="/register">
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
}
export default Login;