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

    // personalized quote generator 
    const quotes = [
    "Every transaction is another step toward financial freedom.",
    "Small savings become great wealth.",
    "Discipline today builds prosperity tomorrow.",
    "Invest in your future, one decision at a time.",
    "Financial confidence starts with consistency."
  ];

const quote =
    quotes[
        new Date().getDate() %
        quotes.length
    ];

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
            {quote}
        </p>
        <p className="today-date">
                    {today}
        </p>
      </div>

      <div className="dashboard-profile">
       <div className="profile-avatar">
          {user?.avatar ? (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="Profile"
            />
          ) : (
            user?.firstName?.charAt(0)
          )}
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