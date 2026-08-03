import "../../styles/auth.css";
function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>BANKIST PRO</h1>
          <span>Premium Digital Banking</span>
        </div>
        <div className="auth-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
export default AuthLayout;