import "../../styles/components/skeleton.css";
function TransactionSkeleton() {
    return (
        <>
            {[...Array(5)].map((_, index) => (
                <div
                    className="transaction-item skeleton-item"
                    key={index}
                >
                    <div>
                        <div className="skeleton skeleton-title"></div>
                        <div className="skeleton skeleton-text"></div>
                        <div className="skeleton skeleton-date"></div>
                        <div className="skeleton skeleton-reference"></div>
                    </div>
                    <div className="transaction-right">
                        <div className="skeleton skeleton-status"></div>
                        <div className="skeleton skeleton-amount"></div>
                    </div>
                </div>
            ))}
        </>
    );
}
export default TransactionSkeleton;