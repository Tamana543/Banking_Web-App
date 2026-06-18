import { useAuth } from "../../context/AuthContext";

function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <p className="brand-name">
          BANKIST PRO
        </p>

        <h1>
          Welcome back,
          <span> {user?.firstName}</span>
        </h1>

        <p className="header-subtitle">
          Wealth begins with discipline.
        </p>
      </div>

      <div className="dashboard-profile">
        <div className="profile-avatar">
          {user?.firstName?.charAt(0)}
        </div>

        <div>
          <h4>
            {user?.firstName} {user?.lastName}
          </h4>

          <p>Premium Member</p>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;