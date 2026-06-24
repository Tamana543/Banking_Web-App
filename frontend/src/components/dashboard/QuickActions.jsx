function QuickActions({onDeposit}) {
 return (
    <section className="quick-actions">

      <button>
        Transfer
      </button>

      <button>
        Request Loan
      </button>

      <button
        onClick={onDeposit}
      >
        Deposit
      </button>

    </section>
  );
}

export default QuickActions;