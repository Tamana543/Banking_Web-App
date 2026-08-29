import "../../styles/dashboard/quick-actions.css";
import { useNavigate } from "react-router-dom";
function QuickActions({
  onDeposit,
  onWithdraw,
}) {
  const navigate = useNavigate();
  return (
    <section
      className="quick-actions"
      aria-labelledby="quick-actions-title"
    >
      <button type="button" className="action-card" onClick={() => navigate("/transfer")} aria-label="Transfer money" >
        Transfer
      </button>
      <button type="button" className="action-card" onClick={onWithdraw} aria-label="Withdraw money" >
        Withdraw
      </button>
      <button type="button" className="action-card" onClick={onDeposit} aria-label="Deposit money" >
        Deposit
      </button>
      <button type="button" className="action-card" onClick={() => navigate("/savings-goals")} aria-label="Savings goals" > Savings </button>
    </section>
  );
}
export default QuickActions;