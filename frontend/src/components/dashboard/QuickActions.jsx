import "../../styles/dashboard/quick-actions.css"

function QuickActions({
  onDeposit,
  onWithdraw,
  onTransfer,
}) {
  return (
    <section className="quick-actions">

      <button
        className="action-card"
        onClick={onTransfer}
      >
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