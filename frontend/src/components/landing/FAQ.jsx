import { useEffect, useRef, useState } from "react";
import "../../styles/landing/faq.css";
const faqs = [
  {
    question: "Is Bankist Pro a real bank?",
    answer:
      "No. Bankist Pro is a demo banking platform built as a portfolio project. No real money is involved, so please don't enter real financial details or reuse a password from another service.",
  },
  {
    question: "How do I open an account?",
    answer:
      "Choose Open Account, then enter your name, email, a password of at least 12 characters and a 4-digit PIN. Your account is ready right away.",
  },
  {
    question: "What is the PIN for?",
    answer:
      "Your PIN confirms sensitive actions: transfers, withdrawals, loan requests and repayments, and savings contributions. After five wrong attempts, PIN-protected actions are locked for 15 minutes.",
  },
  {
    question: "How do loans work?",
    answer:
      "You can request a loan of up to twice your balance, one at a time. A request stays pending until an administrator reviews it. Once approved, the money is added to your balance, and you can repay it in as many payments as you like, with no interest.",
  },
  {
    question: "How is my account protected?",
    answer:
      "Passwords and PINs are stored hashed, never in plain text. Sessions expire automatically, your account locks after repeated wrong passwords, and requests are rate-limited. Every sensitive action also needs your PIN.",
  },
  {
    question: "Can I download my transactions?",
    answer:
      "Yes. From the Transactions page you can export your history as a CSV file, or download or print a PDF statement for any date range.",
  },
  {
    question: "What if my account gets locked?",
    answer:
      "After repeated wrong passwords the account locks for a short time and unlocks by itself. If it's urgent, an administrator can unlock it for you.",
  },
];

function FAQ() {
   const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      section.classList.add("faq-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("faq-visible");
          observer.unobserve(section);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
    };
  }, []);
  return(
    <section  ref={sectionRef} className="faq-section" id="faq" aria-labelledby="faq-heading">
       <div className="faq-heading">
          <span className="faq-label">QUESTIONS</span>
          <h2 id="faq-heading">
            Good to know <span>before you start.</span>
          </h2>
          <p>
            Quick answers about accounts, security, loans and your data.
          </p>
      </div>
      <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <h3>
                  <button type="button" id={`faq-button-${index}`} className="faq-question" aria-expanded={isOpen} aria-controls={`faq-panel-${index}`} onClick={() => setOpenIndex(isOpen ? -1 : index)} >
                    <span>{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                <div id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-button-${index}`} aria-hidden={!isOpen} className="faq-answer" >
                  <div className="faq-answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
export default FAQ;