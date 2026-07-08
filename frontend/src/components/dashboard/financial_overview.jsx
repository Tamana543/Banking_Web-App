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

}