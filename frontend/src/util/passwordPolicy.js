export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_BYTES = 72;
const getUtf8ByteLength = (value) => {
  return new TextEncoder().encode(value).length;
};
export const validatePassword = (password) => {
  if (typeof password !== "string" || !password) {
    return "Password is required.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (getUtf8ByteLength(password) > PASSWORD_MAX_BYTES) {
    return "Password is too long. Use no more than 72 UTF-8 bytes.";
  }
  return null;
};