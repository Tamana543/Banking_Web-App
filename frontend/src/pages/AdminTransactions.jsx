import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import { getAllTransactions } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import { generateTransactionId } from "../util/transactionId";
import "../styles/dashboard/dashboard.css";
import "../styles/recent-transacrions.css";
import "../styles/components/modal.css";

const TYPE_LABELS = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  loan: "Loan",
};

function AdminTransactions() {}
