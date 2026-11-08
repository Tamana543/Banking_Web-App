export const BASE_CURRENCY = "USD";
export const RATES_NOTE = "Demo rates, not live market prices.";

// demo currency equivalent prices 
export const CURRENCIES = {
  USD: { name: "US Dollar", rate: 1, decimals: 2 },
  EUR: { name: "Euro", rate: 0.92, decimals: 2 },
  GBP: { name: "British Pound", rate: 0.79, decimals: 2 },
  BDT: { name: "Bangladeshi Taka", rate: 122, decimals: 2 },
  INR: { name: "Indian Rupee", rate: 88, decimals: 2 },
  JPY: { name: "Japanese Yen", rate: 150, decimals: 0 },
  CAD: { name: "Canadian Dollar", rate: 1.37, decimals: 2 },
  AUD: { name: "Australian Dollar", rate: 1.52, decimals: 2 },
};

export const isSupportedCurrency = (code) =>
  typeof code === "string" &&
  Object.prototype.hasOwnProperty.call(CURRENCIES, code);