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