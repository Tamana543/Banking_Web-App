import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function CTA() {
     const navigate = useNavigate();

  return (
     <section className="section section--sign-up">
      <div className="section__title">
        <h3 className="section__header">
          The best day to join Bankist was one year ago. The second best is
          today!
        </h3>
      </div>
       <Link to="/register" className="btn">
        Open your free account today!
      </Link>
    </section>
    
  );
}

export default CTA;