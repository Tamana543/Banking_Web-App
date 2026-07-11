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

const [alert, setAlert] = useState({
  type: "",
  message: "",
});
  return (
    <DashboardLayout>

      <DashboardHeader />

    </DashboardLayout>
  );
}

export default Loan;