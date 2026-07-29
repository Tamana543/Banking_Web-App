import "../../styles/components/skeleton.css";

function StatsCardsSkeleton() {
  return (
    <div className="stats-skeleton">
      {[1, 2, 3].map((item) => (
        <div className="stat-card-skeleton" key={item}>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-number"></div>
        </div>
      ))}
    </div>
  );
}

export default StatsCardsSkeleton;