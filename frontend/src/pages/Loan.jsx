import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionList from "../components/dashboard/TransactionList";
import handleApiError from "../util/handleApiError";
import { useToast } from "../context/ToastContext";
import { applyLoan, getTransactions } from "../api/transactionApi";
import "../styles/loan.css";
// hooks 
import useTransactions from "../hooks/useTransactions";
function Loan() {
     const { showToast } = useToast();
     const [loanAmount, setLoanAmount] = useState("");
     const [purpose, setPurpose] = useState("");
     const { transactions, loadTransactions } = useTransactions();
     // LoanHundler
     const handleLoan = async () => {
          // clean the previous alert first 
          if (!loanAmount || Number(loanAmount) <= 0) {
          showToast( "Enter a valid loan amount.", "error");
          return;
          }
          if (!purpose.trim()) {
          showToast( "Loan purpose is required.", "error" );
          return;
          }
          try {
          const data = await applyLoan(
               Number(loanAmount),
               purpose
          );
          showToast( data.message, "success" );
          setLoanAmount("");
          setPurpose("");
           await loadTransactions();

          }
          catch (error) {
          showToast( handleApiError(error), "error" );
          }
     };
     return (
          <DashboardLayout>
                    <DashboardHeader />
                    <section className="loan-page">
                         <div className="loan-card">
                              <h2>Apply for a Loan</h2>
                              <p> Request a personal loan instantly.</p>
                              <input type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e)=> setLoanAmount(e.target.value) } />
                              <textarea placeholder="Purpose of Loan" value={purpose} onChange={(e)=> setPurpose(e.target.value) } />
                              <button className="loan-btn" onClick={handleLoan} > Apply for Loan </button>
                         </div>
                         <TransactionList title="Loan History" transactions={transactions.filter( (transaction)=> transaction.type==="loan" )} />
                    </section>
          </DashboardLayout>
     );
}
export default Loan;