import "../../styles/components/skeleton.css";
function BalanceCardSkeleton() {
  return (
    <section className="balance-card skeleton-card" aria-label="Loading account balance" aria-busy="true">
      <div className="skeleton skeleton-title" aria-hidden="true" ></div>
      <div className="skeleton skeleton-balance" aria-hidden="true" ></div>
      <div className="skeleton skeleton-text" aria-hidden="true" ></div>
      <span className="sr-only"> Your account balance is loading.
      </span>
    </section>
  );
}
export default BalanceCardSkeleton;