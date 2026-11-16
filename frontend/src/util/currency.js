export const convert = (amount, from, to, currencies) => {
  const fromRate = currencies?.[from]?.rate;
  const toRate = currencies?.[to]?.rate;
  if (!fromRate || !toRate) return null;
  return (Number(amount) / fromRate) * toRate;
};

export const formatCurrency = (amount, code, currencies) => {
  const decimals = currencies?.[code]?.decimals ?? 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};