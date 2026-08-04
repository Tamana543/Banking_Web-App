import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
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
        if (!formData.firstName.trim()) {
            showToast("First name is required.", "error");
            return;
        }
        if (!formData.lastName.trim()) {
            showToast("Last name is required.", "error");
            return;
        }
        if (!formData.email.trim()) {
            showToast("Email is required.", "error");
            return;
        }
        if (!formData.password.trim()) {
            showToast("Password is required.", "error");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }
        if (formData.pin.length !== 4) {
            showToast("PIN must contain exactly 4 digits.", "error");
            return;
        }
        try {
            const data = await registerUser(formData);
            login(data.user, data.token);
            showToast(
                "Welcome to Bankist Pro!",
                "success"
            );
            navigate("/dashboard");
        } catch (error) {
            showToast(
                handleApiError(error),
                "error"
            );
        }
    };
    return (
        <AuthLayout
            title="Create Your Account"
            subtitle="Join thousands of users managing their finances securely."
        >
            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >
                <div className="name-row">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Security PIN</label>
                    <input
                        type="password"
                        name="pin"
                        placeholder="4-digit PIN"
                        maxLength={4}
                        value={formData.pin}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="auth-btn"
                >
                    Create Account
                </button>
            </form>
            <div className="auth-footer">
                Already have an account?
                <Link to="/login">
                    Login
                </Link>
            </div>
        </AuthLayout>
    );
}
export default Register;