import { BASE_CURRENCY, CURRENCIES, RATES_NOTE, } from "../utils/currencies.js";

export const getRates = (req, res) => {
  res.status(200).json({
    success: true,
    base: BASE_CURRENCY,
    note: RATES_NOTE,
    currencies: CURRENCIES,
  });
};