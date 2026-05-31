import Navbar from "../components/Navbar";
import { Links } from "react-router-dom";

function Landing() {
  return (
       <div>
      <Navbar />

      <section>
        <h1>Welcome to Bankist 2.0</h1>

        <p>
          Manage transfers, loans, savings goals and analytics in one place.
        </p>

        <Link to="/login">
          <button>Open Account</button>
        </Link>
      </section>
    </div>
  );
}

export default Landing;