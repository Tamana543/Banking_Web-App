import "../../styles/auth.css";
function AuthLayout({
    title,
    subtitle,
    children,
}) {
    return (
        <div className="auth-page">
            <div className="auth-decoration">
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
                    savings goals, loans, analytics and complete
                    financial control—all in one place.
                </p>
            </div>
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default AuthLayout;