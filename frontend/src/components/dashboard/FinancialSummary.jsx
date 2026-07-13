function FinancialSummary({balance, income, expense, savings,}){
     const cards = [
        {
            title: "Current Balance",
            value: balance,
        },
        {
            title: "Total Income",
            value: income,
        },
        {
            title: "Total Expenses",
            value: expense,
        },
        {
            title: "Net Savings",
            value: savings,
        },
    ];
}