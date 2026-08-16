import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import {
    isEmpty,
    isValidEmail,
    isPin,
} from "../util/validation";
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
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        pin: "",
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
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            pin: "",
            form: "",
        };
        if (isEmpty(formData.firstName)) {
            newErrors.firstName = "First name is required.";
        }
        if (isEmpty(formData.lastName)) {
            newErrors.lastName = "Last name is required.";
        }
        if (isEmpty(formData.email)) {
            newErrors.email = "Email is required.";
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (isEmpty(formData.password)) {
            newErrors.password = "Password is required.";
        }
        if (isEmpty(formData.confirmPassword)) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }
        if (isEmpty(formData.pin)) {
            newErrors.pin = "Security PIN is required.";
        } else if (!isPin(formData.pin)) {
            newErrors.pin =
                "PIN must contain exactly 4 digits.";
        }
        if (
            newErrors.firstName ||
            newErrors.lastName ||
            newErrors.email ||
            newErrors.password ||
            newErrors.confirmPassword ||
            newErrors.pin
        ) {
            setErrors(newErrors);
            if (newErrors.firstName) {
                document
                    .getElementById("register-first-name")
                    ?.focus();
            } else if (newErrors.lastName) {
                document
                    .getElementById("register-last-name")
                    ?.focus();
            } else if (newErrors.email) {
                document
                    .getElementById("register-email")
                    ?.focus();
            } else if (newErrors.password) {
                document
                    .getElementById("register-password")
                    ?.focus();
            } else if (newErrors.confirmPassword) {
                document
                    .getElementById("register-confirm-password")
                    ?.focus();
            } else if (newErrors.pin) {
                document
                    .getElementById("register-pin")
                    ?.focus();
            }
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
            title="Create Your Account"
            subtitle="Join thousands of users managing their finances securely."
        >
            <form
                className="auth-form"
                onSubmit={handleSubmit}
                noValidate
                aria-describedby={
                    errors.form
                        ? "register-form-error"
                        : undefined
                }
            >
                {errors.form && (
                    <div
                        id="register-form-error"
                        className="form-error form-error-general"
                        role="alert"
                    >
                        {errors.form}
                    </div>
                )}
                <div className="name-row">
                    <div className="form-group">
                        <label htmlFor="register-first-name">
                            First Name
                        </label>
                        <input
                            id="register-first-name"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                            aria-required="true"
                            aria-invalid={Boolean(
                                errors.firstName
                            )}
                            aria-describedby={
                                errors.firstName
                                    ? "register-first-name-error"
                                    : undefined
                            }
                        />
                        {errors.firstName && (
                            <span
                                id="register-first-name-error"
                                className="form-error"
                            >
                                {errors.firstName}
                            </span>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-last-name">
                            Last Name
                        </label>
                        <input
                            id="register-last-name"
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            autoComplete="family-name"
                            required
                            aria-required="true"
                            aria-invalid={Boolean(
                                errors.lastName
                            )}
                            aria-describedby={
                                errors.lastName
                                    ? "register-last-name-error"
                                    : undefined
                            }
                        />
                        {errors.lastName && (
                            <span
                                id="register-last-name-error"
                                className="form-error"
                            >
                                {errors.lastName}
                            </span>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">
                        Email
                    </label>
                    <input
                        id="register-email"
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
                                ? "register-email-error"
                                : undefined
                        }
                    />
                    {errors.email && (
                        <span
                            id="register-email-error"
                            className="form-error"
                        >
                            {errors.email}
                        </span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">
                        Password
                    </label>
                    <input
                        id="register-password"
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                        aria-required="true"
                        aria-invalid={Boolean(
                            errors.password
                        )}
                        aria-describedby={
                            errors.password
                                ? "register-password-error"
                                : undefined
                        }
                    />
                    {errors.password && (
                        <span
                            id="register-password-error"
                            className="form-error"
                        >
                            {errors.password}
                        </span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="register-confirm-password">
                        Confirm Password
                    </label>
                    <input
                        id="register-confirm-password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                        aria-required="true"
                        aria-invalid={Boolean(
                            errors.confirmPassword
                        )}
                        aria-describedby={
                            errors.confirmPassword
                                ? "register-confirm-password-error"
                                : undefined
                        }
                    />
                    {errors.confirmPassword && (
                        <span
                            id="register-confirm-password-error"
                            className="form-error"
                        >
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="register-pin">
                        Security PIN
                    </label>
                    <input
                        id="register-pin"
                        type="password"
                        name="pin"
                        placeholder="4-digit PIN"
                        maxLength={4}
                        inputMode="numeric"
                        value={formData.pin}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        aria-required="true"
                        aria-invalid={Boolean(errors.pin)}
                        aria-describedby={
                            errors.pin
                                ? "register-pin-error"
                                : undefined
                        }
                    />
                    {errors.pin && (
                        <span
                            id="register-pin-error"
                            className="form-error"
                        >
                            {errors.pin}
                        </span>
                    )}
                </div>
                <button
                    type="submit"
                    className="auth-btn"
                >
                    Create Account
                </button>
            </form>
            <div className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </div>
        </AuthLayout>
    );
}
export default Register;