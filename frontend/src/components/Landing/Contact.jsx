import { useEffect, useRef, useState } from "react";
import { sendContactMessage, subscribeNewsletter } from "../../api/publicApi";
import { useToast } from "../../context/ToastContext";
import { isValidEmail } from "../../util/validation";
import "../../styles/landing/contact.css";
import "../../styles/responsive.css"

const MAX_MESSAGE = 1000;

function Contact() {
  const sectionRef = useRef(null);
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [newsletter, setNewsletter] = useState({ email: "", website: "" });
  const [subscribing, setSubscribing] = useState(false);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      section.classList.add("contact-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("contact-visible");
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
}
export default Contact;