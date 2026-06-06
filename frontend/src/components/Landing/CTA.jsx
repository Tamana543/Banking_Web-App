import { useNavigate } from "react-router-dom";



function CTA() {
     const navigate = useNavigate();

  return (
     <section class="section section--sign-up">
      <div class="section__title">
        <h3 class="section__header">
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