import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import useRates from "../hooks/useRates";
import { convert, formatCurrency } from "../util/currency";
import "../styles/converter.css";
import "../styles/responsive.css";

function Converter(){
 const { user } = useAuth();
  const rates = useRates();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(
    user?.displayCurrency && user.displayCurrency !== "USD"
      ? user.displayCurrency
      : "EUR"
  );

  const currencies = rates?.currencies;
  const codes = currencies ? Object.keys(currencies) : [];
  const numeric = Number(amount);
  const valid = amount !== "" && Number.isFinite(numeric) && numeric >= 0;
  const result = valid && currencies ? convert(numeric, from, to, currencies) : null;
  const unitRate = currencies ? convert(1, from, to, currencies) : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return(
     <DashboardLayout>
          <DashboardHeader/>
          <section className="converter-page">
               <h2>Currency Converter</h2>
               <p className="converter-subtitle">
               See roughly what an amount is worth in another currency.
               </p>
               {!rates ? (
          <p>Loading rates...</p>
        ) : (
          <div className="converter-card">
            <div className="converter-field converter-amount">
              <label htmlFor="converter-amount">Amount</label>
              <input id="converter-amount" type="number" min="0" max="1000000000000" step="any" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="converter-row">
              <div className="converter-field">
                <label htmlFor="converter-from">From</label>
                <select
                  id="converter-from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {codes.map((code) => (
                    <option key={code} value={code}>
                      {code} - {currencies[code].name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="converter-swap"
                onClick={swap}
                aria-label="Swap currencies"
              >
                ⇄
              </button>
              <div className="converter-field">
                <label htmlFor="converter-to">To</label>
                <select
                  id="converter-to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  {codes.map((code) => (
                    <option key={code} value={code}>
                      {code} - {currencies[code].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {result !== null && (
              <div className="converter-result" aria-live="polite">
                <p>
                  {formatCurrency(numeric, from, currencies)} is about
                </p>
                <h3>{formatCurrency(result, to, currencies)}</h3>
                {unitRate !== null && (
                  <small>
                    1 {from} ={" "}
                    {unitRate.toLocaleString("en-US", {
                      maximumFractionDigits: unitRate < 0.01 ? 6 : 4,
                    })}{" "}
                    {to}
                  </small>
                )}
              </div>
            )}

            <span className="converter-note">
              {rates.note} Your balance and all transactions are always in USD.
            </span>
          </div>
        )}
          </section>
     </DashboardLayout>
  )

}
export default Converter