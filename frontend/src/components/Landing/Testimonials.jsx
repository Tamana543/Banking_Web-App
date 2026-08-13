import { useEffect, useRef, useState } from "react";
import user_1 from "../../assets/images/user-1.jpg";
import user_2 from "../../assets/images/user-2.jpg";
import user_3 from "../../assets/images/user-3.jpg";
import "../../styles/landing/testimonials.css";
function Testimonials() {
    const sectionRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const testimonials = [
        {
            title: "Best financial decision ever!",
            text:
                "Bankist Pro completely changed the way I manage my money. Everything is simple, clear, and available exactly when I need it.",
            name: "Aarav Lynn",
            location: "San Francisco, USA",
            image: user_1,
        },
        {
            title: "Finally banking that feels simple",
            text:
                "I used to find managing my finances complicated. Bankist Pro gives me everything I need without making things unnecessarily difficult.",
            name: "Miyah Miles",
            location: "London, UK",
            image: user_2,
        },
        {
            title: "Finally free from old-school banks",
            text:
                "Transfers are fast, my finances are easy to understand, and I can manage everything from one place. It feels like banking should have always been this way.",
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
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    section.classList.add(
                        "testimonials-visible"
                    );
                    observer.unobserve(section);
                }
            },
            {
                threshold: 0.15,
            }
        );
        observer.observe(section);
        return () => {
            observer.disconnect();
        };
    }, []);
    return (
        <section
            ref={sectionRef}
            className="testimonials-section"
            id="testimonials"
            aria-labelledby="testimonials-heading"
        >
            <div className="testimonials-heading">
                <span
                    className="testimonials-label"
                    aria-hidden="true"
                >
                    CUSTOMER STORIES
                </span>
                <h2 id="testimonials-heading">
                    Trusted by people who
                    <span> value better banking.</span>
                </h2>
                <p>
                    Real experiences from people using
                    Bankist Pro to manage their money with
                    more confidence and control.
                </p>
            </div>
            <div
                className="testimonial-slider"
                aria-roledescription="carousel"
                aria-label="Customer testimonials"
            >
                <div
                    className="testimonial-track"
                    style={{
                        transform: `translateX(-${activeSlide * 100}%)`,
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <article
                            className="testimonial-slide"
                            key={testimonial.name}
                            aria-hidden={activeSlide !== index}
                            aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
                        >
                            <div className="testimonial-card">
                                <div
                                    className="testimonial-quote"
                                    aria-hidden="true"
                                >
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
                        </article>
                    ))}
                </div>
                <button
                    type="button"
                    className="testimonial-btn testimonial-btn-left"
                    onClick={previousSlide}
                    aria-label="Previous testimonial"
                >
                    <span aria-hidden="true">←</span>
                </button>
                <button
                    type="button"
                    className="testimonial-btn testimonial-btn-right"
                    onClick={nextSlide}
                    aria-label="Next testimonial"
                >
                    <span aria-hidden="true">→</span>
                </button>
            </div>
            <div
                className="testimonial-dots"
                role="group"
                aria-label="Choose testimonial"
            >
                {testimonials.map((testimonial, index) => (
                    <button
                        type="button"
                        key={testimonial.name}
                        className={`testimonial-dot ${
                            activeSlide === index
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveSlide(index)
                        }
                        aria-label={`Show testimonial ${index + 1}`}
                        aria-current={
                            activeSlide === index
                                ? "true"
                                : undefined
                        }
                    />
                ))}
            </div>
        </section>
    );
}
export default Testimonials;