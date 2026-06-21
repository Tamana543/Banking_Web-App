import { useAuth } from "../context/AuthContext";

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
        <p className="balance-label">
          Available Balance
        </p>

        <h1 className="balance-amount">
          $
          {user?.balance?.toLocaleString() || "0"}
        </h1>
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