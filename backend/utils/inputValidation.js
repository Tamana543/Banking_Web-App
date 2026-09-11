export const isValidPositiveAmount = (value) => {
  const amount = Number(value);
  return (
    Number.isFinite(amount) &&
    amount > 0
  );
};
export const isValidEmail = (email) => {
  if (typeof email !== "string") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};
export const isValidObjectId = (id) => {
  return (
    typeof id === "string" &&
    /^[a-f\d]{24}$/i.test(id)
  );
};
export const isValidText = (
  value,
  maxLength = 500
) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
};