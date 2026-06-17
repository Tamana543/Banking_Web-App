import { useAuth } from "../../context/AuthContext";

function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div>
        <h1>Welcome back, {user?.firstName} 👋</h1>
        <p>Manage your finances with confidence.</p>
      </div>

      <div className="dashboard-profile">
        <img
          src={
            user?.avatar ||
            "https://ui-avatars.com/api/?name=" +
              user?.firstName +
              "+" +
              user?.lastName
          }
          alt="Profile"
        />

        <span>
          {user?.firstName} {user?.lastName}
        </span>
      </div>
    </header>
  );
}

export default DashboardHeader;