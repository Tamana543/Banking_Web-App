export const validatePassword = (password) => {
  if (typeof password !== "string") {
    return "Password is required.";
  }
  if (password.length < 12) {
    return "Password must contain at least 12 characters.";
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    return "Password is too long. Use no more than 72 UTF-8 bytes.";
  }
  return null;
};