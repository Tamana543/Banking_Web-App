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
     return (
        <section className="financial-summary">
            {
                cards.map((card) => (
                    <div
                        className="summary-card"
                        key={card.title}
                    >
                        <h4>
                            {card.title}
                        </h4>
                        <h2>
                            $
                            {card.value.toLocaleString()}
                        </h2>
                    </div>
                ))
            }
        </section>
    );
}
export default FinancialSummary;