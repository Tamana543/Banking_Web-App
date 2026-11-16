export const generateTransactionId = (id) => {
  if (!id) return "";

  return `TX-${id.toString().slice(-8).toUpperCase()}`;
};