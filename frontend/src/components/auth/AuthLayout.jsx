import { Link } from "react-router-dom";
import "../../styles/auth.css";
function AuthLayout({
    title,
    subtitle,
    children,
}) {
    return (
        <main className="auth-page">
            <div
                className="auth-decoration"
                aria-hidden="true"
            >
                <div className="floating-card card-one"></div>
                <div className="floating-card card-two"></div>
                <div className="floating-card card-three"></div>
                <div className="floating-card card-four"></div>
                <div className="floating-circle circle-one"></div>
                <div className="floating-circle circle-two"></div>
                <div className="floating-circle circle-three"></div>
                <div className="star s1"></div>
                <div className="star s2"></div>
                <div className="star s3"></div>
                <div className="star s4"></div>
                <div className="star s5"></div>
            </div>
            <section className="auth-left">
                <Link
                    to="/"
                    className="auth-logo"
                    aria-label="Bankist Pro home"
                >
                    BANKIST PRO
                </Link>
                <h1 className="auth-tagline">
                    Modern Banking
                    <br />
                    Built For Everyone.
                </h1>
                <p className="auth-description">
                    Secure digital banking with instant transfers,
                    savings goals, loans, analytics and complete
                    financial control—all in one place.
                </p>
            </section>
            <section className="auth-right">
                <div className="auth-card">
                    <header className="auth-header">
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </header>
                    {children}
                </div>
            </section>
        </main>
    );
}
export default AuthLayout;