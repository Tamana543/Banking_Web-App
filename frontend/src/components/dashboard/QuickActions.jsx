function QuickActions({onDeposit}) {
 return (
    <section className="quick-actions">

      <button className="action-card">
        Transfer
      </button>

      <button className="action-card">
        Request Loan
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