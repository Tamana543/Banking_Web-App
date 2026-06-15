import validator from "validator";
import User from "../models/User.js";

const validateRegister = async (req, res, next) => {
  const { firstName, lastName, email, password,  confirmPassword, pin } = req.body;

  const cleanFirstName = firstName?.trim();
  const cleanLastName = lastName?.trim();
  const cleanEmail = email?.toLowerCase().trim();


  if (!cleanFirstName || cleanFirstName.length < 2) {
    return res.status(400).json({
      success: false,
      message: "First name must be at least 2 characters.",
    });
  }

  if (cleanFirstName.length > 30) {
    return res.status(400).json({
      success: false,
      message: "First name cannot exceed 30 characters.",
    });
  }


  if (!cleanLastName || cleanLastName.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Last name must be at least 2 characters.",
    });
  }

  if (cleanLastName.length > 30) {
    return res.status(400).json({
      success: false,
      message: "Last name cannot exceed 30 characters.",
    });
  }

  if (!cleanEmail || !validator.isEmail(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  
  if (!password) {
  return res.status(400).json({
    success: false,
    message: "Password is required.",
  });
}

if (password.length < 8) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 8 characters long.",
  });
}

if (password.length > 50) {
  return res.status(400).json({
    success: false,
    message: "Password cannot exceed 50 characters.",
  });
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]+$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  });
}
if (!confirmPassword) {
  return res.status(400).json({
    success: false,
    message: "Please confirm your password.",
  });
}

if (password !== confirmPassword) {
  return res.status(400).json({
    success: false,
    message: "Passwords do not match.",
  });
}
  // PIN
  if (!pin) {
    return res.status(400).json({
      success: false,
      message: "PIN is required.",
    });
  }

  if (!/^\d{4}$/.test(String(pin))) {
    return res.status(400).json({
      success: false,
      message: "PIN must contain exactly 4 digits.",
    });
  }


  const existingUser = await User.findOne({
    email: cleanEmail,
  });
    console.log("Existing user:", existingUser);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }
  req.body.firstName = cleanFirstName;
  req.body.lastName = cleanLastName;
  req.body.email = cleanEmail;

  next();
};

export default validateRegister;