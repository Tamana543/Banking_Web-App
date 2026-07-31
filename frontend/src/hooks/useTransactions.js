import { useEffect, useState } from "react";
import { getTransactions } from "../api/transactionApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
function useTransactions() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.transactions);
    } catch (error) {
      showToast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTransactions();
  }, []);
  return {
    transactions,
    loading,
    loadTransactions,
    setTransactions,
  };
}
export default useTransactions;