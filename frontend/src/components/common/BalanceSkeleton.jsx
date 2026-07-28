import "../../styles/components/skeleton.css";

function BalanceCardSkeleton() {
  return (
    <div className="balance-card skeleton-card">
      <div className="skeleton skeleton-title"></div>

      <div className="skeleton skeleton-balance"></div>

      <div className="skeleton skeleton-text"></div>
    </div>
  );
}

export default BalanceCardSkeleton;