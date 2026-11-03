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

  return(
     <section ref={sectionRef} className="contact-section" id="contact" aria-labelledby="contact-heading">
           <div className="contact-grid">
               <div className="contact-info">
                    <span className="contact-label">CONTACT</span>
                    <h2 id="contact-heading">
                    Questions or feedback?
                    <br />
                    <span>We'd love to hear it.</span>
                    </h2>
                    <p>
                    Send a message about the project, report a problem, or just say hello.
                    </p>

                    <div className="newsletter-card">
                    <h3>Stay in the loop</h3>
                    <p>Get a note when new Bankist Pro features are added.</p>
                    <form className="newsletter-form" onSubmit={handleSubscribe} noValidate>
                    <label htmlFor="newsletter-email" className="sr-only">
                         Email address
                    </label>
                    <input id="newsletter-email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} value={newsletter.email} onChange={(e) => setNewsletter({ ...newsletter, email: e.target.value }) } />
                    <input type="text" name="website" className="contact-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={newsletter.website} onChange={(e) => setNewsletter({ ...newsletter, website: e.target.value }) } />
                    <button type="submit" className="contact-btn" disabled={subscribing}>
                         {subscribing ? "Subscribing..." : "Subscribe"}
                    </button>
                    </form>
                    <span className="newsletter-note">
                    Demo project: your email is saved, but no newsletters are sent yet.
                    </span>
                    </div>
               </div>
           </div>
     </section>
  )
}
export default Contact;