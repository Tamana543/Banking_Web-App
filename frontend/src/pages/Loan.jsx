import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionList from "../components/dashboard/TransactionList";
import AlertMessage from "../components/common/AlertMessage";
import { applyLoan, getTransactions } from "../api/transactionApi";
import "../styles/loan.css";
function Loan() {
     const [loanAmount, setLoanAmount] = useState("");
     const [purpose, setPurpose] = useState("");
     const [transactions, setTransactions] = useState([]);
     const [alert, setAlert] = useState({ type: "", message: "", });
// Transaction with loan in it 
     const loadTransactions = async () => {
          try {
          const data = await getTransactions();
          setTransactions(data.transactions);
          } catch (error) {
          console.error(error);
          }
     };
     // LoanHundler
     const handleLoan = async () => {
          if (!loanAmount || Number(loanAmount) <= 0) {
          setAlert({
               type: "error",
               message: "Enter a valid loan amount.",
          });
          return;
          }
          if (!purpose.trim()) {
          setAlert({
               type: "error",
               message: "Loan purpose is required.",
          });
          return;
          }
          try {
          await applyLoan(
               Number(loanAmount),
               purpose
          );
          setAlert({
               type: "success",
               message: "Loan approved successfully.",
          });
          setLoanAmount("");
          setPurpose("");
          loadTransactions();
          }
          catch (error) {
          setAlert({
               type: "error",
               message: error.message,
          });
          }
     };
     useEffect(() => { loadTransactions();}, []);
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
                              <AlertMessage type={alert.type} message={alert.message} />
                         </div>
                         <TransactionList
                         title="Loan History"
                         transactions={transactions.filter(
                         (transaction)=>
                         transaction.type==="loan"
                         )}
                         />
                    </section>
          </DashboardLayout>
     );
}
export default Loan;