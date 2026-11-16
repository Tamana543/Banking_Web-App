import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { API_BASE_URL } from "./config";

function App() {
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) setWaking(true);
    }, 3000);
    fetch(`${API_BASE_URL}/`)
      .catch(() => {})
      .finally(() => {
        finished = true;
        clearTimeout(timer);
        setWaking(false);
      });
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {waking && (
        <div className="server-waking" role="status">
          Waking up the server. On the free plan this can take up to a minute.
        </div>
      )}
      <AppRoutes />
    </>
  );
}

export default App;