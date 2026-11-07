import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildInsights } from "../../util/insights";

function InsightsPanel({ transactions, savingsGoals }) {
  const { user } = useAuth();
  const { facts, tips } = useMemo(
    () =>
      buildInsights({
        transactions,
        savingsGoals,
        balance: Number(user?.balance || 0),
      }),
    [transactions, savingsGoals, user?.balance]
  );

}