import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useAuth } from "../context/AuthContext";
import useRates from "../hooks/useRates";
import { convert, formatCurrency } from "../util/currency";
import "../styles/converter.css";

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

}