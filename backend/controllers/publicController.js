import ContactMessage from "../models/ContactMessage.js";
import Subscriber from "../models/Subscriber.js";
import { isValidEmail, isValidText } from "../utils/inputValidation.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message, website } = req.body;

    if (website) {
      return res.status(200).json({
        success: true,
        message: "Thanks! Your message has been sent.",
      });
    }

    if (
      !isValidText(name, 80) ||
      !isValidEmail(email) ||
      email.trim().length > 254 ||
      !isValidText(message, 1000)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your name, a valid email and a message of up to 1000 characters.",
      });
    }

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Thanks! Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact message error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, website } = req.body;

    if (website) {
      return res.status(200).json({
        success: true,
        message: "You're subscribed.",
      });
    }

    if (!isValidEmail(email) || email.trim().length > 254) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    try {
      await Subscriber.create({ email: email.trim().toLowerCase() });
    } catch (error) {
      
      if (error.code !== 11000) {// already subscribed
        throw error;
      }
    }

    res.status(200).json({ success: true, message: "You're subscribed." });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};