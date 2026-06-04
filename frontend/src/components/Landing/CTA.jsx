import { useNavigate } from "react-router-dom";


function CTA() {
     const navigate = useNavigate();

  return (
    <section>
       <h2>Open Your Free Account Today</h2>

      <button onClick={() => navigate("/register")}>
        Open Account
      </button>
    </section>
  );
}

export default CTA;