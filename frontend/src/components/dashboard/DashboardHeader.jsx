import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard/header.css"
function DashboardHeader() {
  const { user } = useAuth();
  // daytime 
  const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    const today = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <p className="brand-name">
          BANKIST PRO
        </p>
       <p className="greeting">
                    {greeting}
                </p>

        <h1>
          Welcome back,
          <span>
            {" "} 
            {user?.firstName}
          </span>
        </h1>

        <p className="header-subtitle">
          Wealth begins with discipline.
        </p>
        <p className="today-date">
                    {today}
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