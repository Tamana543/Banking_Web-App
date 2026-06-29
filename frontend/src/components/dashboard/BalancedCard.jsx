import {useAuth} from "../../context/AuthContext.jsx"
import "../../styles/dashboard/balance-card.css"
function BalanceCard() {
  const { user } = useAuth();

  return (
    <div className="balance-card">

      <div className="card-top">
        <span className="bank-name">
          BANKIST PRO
        </span>

        <span className="currency-badge">
          {user?.currency || "USD"}
        </span>
      </div>

      <div className="balance-content">

          <span className="portfolio-tag">
            PREMIUM ACCOUNT
          </span>

          <p className="balance-label">
            Total Portfolio Value
          </p>

          <h1 className="balance-amount">
            $
            {user?.balance?.toLocaleString() || "0"}
          </h1>

          <div className="balance-growth">
            +12.4% this month
          </div>

      </div>

      <div className="card-bottom">
        <p className="card-number">
          •••• •••• •••• 4582
        </p>

        <span className="card-type">
          VISA GOLD
        </span>
      </div>

    </div>
  );
}

export default BalanceCard;