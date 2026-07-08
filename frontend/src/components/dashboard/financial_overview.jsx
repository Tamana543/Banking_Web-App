import "../../styles/dashboard/financial_overview.css"
function FinancialOverview({
     transactions =[],
}){
 const income = transactions
        .filter(
            transaction =>
                transaction.type === "deposit"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

    const expenses = transactions
        .filter(
            transaction =>
                transaction.type === "withdrawal"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

    const transfers = transactions
        .filter(
            transaction =>
                transaction.type === "transfer"
        )
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
     );

    const cashFlow =
        income - expenses;

    const savingsRate =
        income === 0
            ? 0
            : Math.round(
                  (cashFlow / income) * 100
     );
      return (

        <section className="financial-overview">

            <div className="overview-header">

                <h3>
                    Financial Overview
                </h3>

                <span>
                    This Month
                </span>

            </div>

            <OverviewRow
                label="Income"
                value={income}
                percent={100}
                color="income"
            />

            <OverviewRow
                label="Expenses"
                value={expenses}
                percent={
                    income
                        ? (expenses / income) * 100
                        : 0
                }
                color="expense"
            />

            <OverviewRow
                label="Transfers"
                value={transfers}
                percent={
                    income
                        ? (transfers / income) * 100
                        : 0
                }
                color="transfer"
            />

            <div className="overview-divider" />

            <div className="overview-summary">

                <div>

                    <small>
                        Net Cash Flow
                    </small>

                    <h2>
                        {cashFlow >= 0 ? "+" : "-"}$
                        {Math.abs(cashFlow).toLocaleString()}
                    </h2>

                </div>

                <div>

                    <small>
                        Savings Rate
                    </small>

                    <h2>
                        {savingsRate}%
                    </h2>

                </div>

            </div>

        </section>

    );
}