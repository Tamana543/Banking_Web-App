import { suspendUser, reactivateUser, unlockUser } from "../api/adminApi";

export const ACTIONS = {
  suspend: {
    title: "Suspend Account",
    submitText: "Suspend",
    success: "Account suspended.",
    run: suspendUser,
    warning: "They will be signed out immediately and cannot log in until you reactivate the account.",
  },
  reactivate: {
    title: "Reactivate Account",
    submitText: "Reactivate",
    success: "Account reactivated.",
    run: reactivateUser,
    warning: "They will be able to log in again.",
  },
  unlock: {
    title: "Unlock Account",
    submitText: "Unlock",
    success: "Account unlocked.",
    run: unlockUser,
    warning: "This clears the login and PIN lockouts so they can try again right away.",
  },
};

export const getStatus = (u) => {
  const now = new Date();
  if (u.isSuspended) {
    return { label: "Suspended", className: "rejected" };
  }
  const loginLocked = u.isLocked && u.lockUntil && new Date(u.lockUntil) > now;
  const pinLocked = u.pinLockedUntil && new Date(u.pinLockedUntil) > now;
  if (loginLocked || pinLocked) {
    return { label: "Locked", className: "pending" };
  }
  return { label: "Active", className: "completed" };
};