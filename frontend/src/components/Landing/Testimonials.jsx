import { useEffect, useRef } from "react";
import user_1 from "../../assets/images/user-1.jpg";
import user_2 from "../../assets/images/user-2.jpg";
import user_3 from "../../assets/images/user-3.jpg";
import "../../styles/landing/testimonials.css";
function Testimonials() {
    const sectionRef = useRef(null);
    const testimonials = [
        {
            image: user_1,
            name: "Aarav Lynn",
            location: "San Francisco, USA",
            title: "Best financial decision ever!",
            text:
                "Bankist Pro completely changed the way I manage my money. Everything is clear, simple, and available exactly when I need it.",
        },
        {
            image: user_2,
            name: "Miyah Miles",
            location: "London, UK",
            title: "Banking finally feels simple.",
            text:
                "I can manage my savings, transfers, and everyday finances without jumping between different platforms. It just works.",
        },
        {
            image: user_3,
            name: "Francisco Gomes",
            location: "Lisbon, Portugal",
            title: "Finally free from old-school banks.",
            text:
                "The clean interface and financial insights make it much easier to understand where my money is going and stay in control.",
        },
    ];
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    section.classList.add("testimonials-visible");
                    observer.unobserve(section);
                }
            },
            {
                threshold: 0.15,
            }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);
    return (
        <section
            ref={sectionRef}
            className="testimonials-section"
            id="testimonials"
        >
            <div className="testimonials-heading">
                <span className="testimonials-label">
                    TRUSTED BY OUR USERS
                </span>
                <h2>
                    Real People.
                    <br />
                    <span>Real Financial Freedom.</span>
                </h2>
                <p>
                    See how Bankist Pro helps people manage their
                    finances with more confidence, clarity, and control.
                </p>
            </div>
            <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                    <article
                        className="testimonial-card"
                        key={testimonial.name}
                    >
                        <div className="testimonial-quote">
                            “
                        </div>
                        <h3>{testimonial.title}</h3>
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
                                <h4>{testimonial.name}</h4>
                                <span>{testimonial.location}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
export default Testimonials;