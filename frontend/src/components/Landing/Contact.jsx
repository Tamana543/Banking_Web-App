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

  const handleContact = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      showToast("Please enter your name.", "error");
      return;
    }
    if (!isValidEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    if (!form.message.trim()) {
      showToast("Please write a message.", "error");
      return;
    }
    try {
      setSending(true);
      const data = await sendContactMessage(form);
      showToast(data.message, "success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSending(false);
    }
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!isValidEmail(newsletter.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    try {
      setSubscribing(true);
      const data = await subscribeNewsletter(newsletter);
      showToast(data.message, "success");
      setNewsletter({ email: "", website: "" });
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubscribing(false);
    }
  };
  
}
export default Contact;