import "../../styles/dashboard/quick-actions.css"

import { useNavigate } from "react-router-dom";


function QuickActions({
  onDeposit,
  onWithdraw,
  onTransfer,
}) {
  const navigate = useNavigate();
  return (
    <section className="quick-actions">

      <button onClick={() => navigate("/transfer")}>
          Transfer
      </button>

      <button
        className="action-card"
        onClick={onWithdraw}
      >
        Withdraw
      </button>

      <button
        className="action-card"
        onClick={onDeposit}
      >
        Deposit
      </button>

    </section>
  );
}

export default QuickActions;