import "../../styles/components/skeleton.css";
function StatsCardsSkeleton() {
  return (
    <section className="stats-skeleton" aria-label="Loading financial statistics" aria-busy="true" >
      {[1, 2, 3, 4].map((item) => (
        <div className="stat-card-skeleton" key={item} aria-hidden="true" >
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-number"></div>
        </div>
      ))}
      <span className="sr-only">
        Financial statistics are loading.
      </span>
    </section>
  );
}
export default StatsCardsSkeleton;