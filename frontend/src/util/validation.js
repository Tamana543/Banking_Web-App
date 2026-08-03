export const isEmpty = (value) => {
  return !value || !value.toString().trim();
};
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const isPositiveNumber = (value) => {
  return Number(value) > 0;
};
export const isPin = (pin) => {
  return /^\d{4}$/.test(pin);
};
export const minLength = (value, length) => {
  return value.length >= length;
};