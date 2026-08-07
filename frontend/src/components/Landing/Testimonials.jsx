import { useState } from "react";
import user_1 from "../../assets/images/user-1.jpg";
import user_2 from "../../assets/images/user-2.jpg";
import user_3 from "../../assets/images/user-3.jpg";
import "../../styles/landing/testimonials.css";

function Testimonials() {
  const [activeSlide, setActiveSlide] = useState(0);
  const testimonials = [
    {
      title: "Best financial decision ever!",
      text: "Bankist Pro completely changed the way I manage my money. Everything is simple, clear, and available exactly when I need it.",
      name: "Aarav Lynn",
      location: "San Francisco, USA",
      image: user_1,
    },
    {
      title: "Finally banking that feels simple",
      text: "I used to find managing my finances complicated. Bankist Pro gives me everything I need without making things unnecessarily difficult.",
      name: "Miyah Miles",
      location: "London, UK",
      image: user_2,
    },
    {
      title: "Finally free from old-school banks",
      text: "Transfers are fast, my finances are easy to understand, and I can manage everything from one place. It feels like banking should have always been this way.",
      name: "Francisco Gomes",
      location: "Lisbon, Portugal",
      image: user_3,
    },
  ];
  const nextSlide = () => {
    setActiveSlide((current) =>
      current === testimonials.length - 1
        ? 0
        : current + 1
    );
  };
  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0
        ? testimonials.length - 1
        : current - 1
    );
  };
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-heading">
        <span className="testimonials-label">
          CUSTOMER STORIES
        </span>
        <h2>
          Trusted by people who
          <span> value better banking.</span>
        </h2>
        <p>
          Real experiences from people using
          Bankist Pro to manage their money with
          more confidence and control.
        </p>
      </div>
      <div className="testimonial-slider">
        <div
          className="testimonial-track"
          style={{
            transform: `translateX(-${activeSlide * 100}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              className="testimonial-slide"
              key={index}
            >
              <div className="testimonial-card">
                <div className="testimonial-quote">
                  “
                </div>
                <h3>
                  {testimonial.title}
                </h3>
                <p className="testimonial-text">
                  {testimonial.text}
                </p>
                <div className="testimonial-author">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-photo"
                  />
                  <div>
                    <h4>
                      {testimonial.name}
                    </h4>
                    <p>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="testimonial-btn testimonial-btn-left"
          onClick={previousSlide}
          aria-label="Previous testimonial"
        >
          ←
        </button>
        <button
          className="testimonial-btn testimonial-btn-right"
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`testimonial-dot ${
              activeSlide === index
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSlide(index)
            }
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
export default Testimonials;