import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import ActionModal from "../components/common/ActionModel";
import useApiAction from "../hooks/useApiAction";
import { getUserDetails } from "../api/adminApi";
import { ACTIONS, getStatus } from "../util/adminUserActions";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import "../styles/dashboard/dashboard.css";
import "../styles/profile.css";
import "../styles/recent-transacrions.css";

const TYPE_LABELS = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  loan: "Loan",
};