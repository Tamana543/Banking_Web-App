import { useEffect, useRef } from "react";
import "../../styles/landing/services.css";
function Services() {
    const sectionRef = useRef(null);
    const services = [
        {
            number: "01",
            title: "Banking & Transfers",
            description:
                "Manage your money, send instant transfers, and keep track of your everyday financial activity from one secure platform.",
        },
        {
            number: "02",
            title: "Savings & Goals",
            description:
                "Set financial goals, monitor your progress, and build better saving habits with clear and simple tools.",
        },
        {
            number: "03",
            title: "Loans & Financing",
            description:
                "Apply for personal loans and keep your borrowing activity organized with transparent information.",
        },
        {
            number: "04",
            title: "Financial Analytics",
            description:
                "Understand where your money goes through clear insights into your income, spending, and transactions.",
        },
    ];
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    section.classList.add("services-visible");
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
            className="services-section"
            id="services"
        >
            <div className="services-heading">
                <span className="services-label">
                    BANKING MADE SIMPLE
                </span>
                <h2>
                    One Platform.
                    <br />
                    <span>Everything Financial.</span>
                </h2>
                <p>
                    From  y banking to long-term financial
                    planning, Bankist Pro gives you the tools to
                    stay in control of your money.
                </p>
            </div>
            <div className="services-grid">
                {services.map((service) => (
                    <article
                        className="service-card"
                        key={service.number}
                    >
                        <span className="service-number">
                            {service.number}
                        </span>
                        <div className="service-line"></div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <span className="service-arrow">
                            →
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
}
export default Services;