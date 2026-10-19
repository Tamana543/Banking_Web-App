import User from "../models/User.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { isValidObjectId } from "../utils/inputValidation.js";
const LOAN_STATUSES = ["pending", "approved", "rejected"];
const TRANSACTION_TYPES = ["deposit", "withdrawal", "transfer", "loan"];
const TRANSACTION_STATUSES = ["pending", "completed", "failed", "approved", "rejected"];

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const [users, total] = await Promise.all([
      User.find()
        .select("firstName lastName email role balance currency avatar isVerified createdAt lastLogin isSuspended isLocked lockUntil pinLockedUntil")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const filter = { type: "loan" };
    if (req.query.status !== undefined) {
      if (!LOAN_STATUSES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }
      filter.status = req.query.status;
    }
    const loans = await Transaction.find(filter)
      .populate("user", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, loans });
  } catch (error) {
    console.error("Admin get loans error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const approveLoan = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan request.",
      });
    }
    session.startTransaction();
    const loan = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        type: "loan",
        status: "pending",
        user: { $ne: req.user._id },
      },
      {
        status: "approved",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { returnDocument: "after", session }
    );
    if (!loan) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Pending loan request not found, or it is your own request.",
      });
    }
    const borrower = await User.findByIdAndUpdate(
      loan.user,
      { $inc: { balance: loan.amount } },
      { session }
    );
    if (!borrower) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Borrower account not found.",
      });
    }
    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Loan approved and funds credited.",
      loan,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Admin approve loan error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  } finally {
    session.endSession();
  }
};

export const rejectLoan = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan request.",
      });
    }
    const loan = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        type: "loan",
        status: "pending",
        user: { $ne: req.user._id },
      },
      {
        status: "rejected",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { returnDocument: "after" }
    );
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Pending loan request not found, or it is your own request.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Loan request rejected.",
      loan,
    });
  } catch (error) {
    console.error("Admin reject loan error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const filter = {};

    if (req.query.type !== undefined) {
      if (!TRANSACTION_TYPES.includes(req.query.type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid type filter.",
        });
      }
      filter.type = req.query.type;
    }
    if (req.query.status !== undefined) {
      if (!TRANSACTION_STATUSES.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }
      filter.status = req.query.status;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin get transactions error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};