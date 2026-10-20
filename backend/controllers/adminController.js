import User from "../models/User.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import SavingsGoal from "../models/SavingsGoal.js";
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

export const suspendUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user.",
      });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "user", isSuspended: false },
      {
        $set: {
          isSuspended: true,
          suspendedAt: new Date(),
          suspendedBy: req.user._id,
        },
        $inc: { sessionVersion: 1 },
      },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Active user account not found. Admin accounts cannot be suspended.",
      });
    }
    res.status(200).json({ success: true, message: "Account suspended." });
  } catch (error) {
    console.error("Admin suspend user error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user.",
      });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isSuspended: true },
      {
        $set: {
          isSuspended: false,
          suspendedAt: null,
          suspendedBy: null,
        },
      },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Suspended user account not found.",
      });
    }
    res.status(200).json({ success: true, message: "Account reactivated." });
  } catch (error) {
    console.error("Admin reactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const unlockUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user.",
      });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          isLocked: false,
          lockUntil: null,
          failedLoginAttempts: 0,
          failedPinAttempts: 0,
          pinLockedUntil: null,
        },
      },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({ success: true, message: "Account unlocked." });
  } catch (error) {
    console.error("Admin unlock user error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getUserDetails = async (req,res)=>{
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user.",
      });
    }
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const [user, totals, recentTransactions, loans, savingsGoals] =
      await Promise.all([
        User.findById(userId).select(
          "firstName lastName email role balance currency isVerified createdAt lastLogin isSuspended suspendedAt isLocked lockUntil pinLockedUntil"
        ),
        Transaction.aggregate([
          {
            $match: {
              user: userId,
              status: { $in: ["completed", "approved"] },
            },
          },
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
              total: { $sum: "$amount" },
            },
          },
        ]), Transaction.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(10),
        Transaction.find({ user: userId, type: "loan" })
          .populate("reviewedBy", "firstName lastName")
          .sort({ createdAt: -1 })
          .limit(10),
        SavingsGoal.find({ user: userId })
          .select("name targetAmount currentAmount status")
          .sort({ createdAt: -1 }),
      ]);
  } catch (error) {
    console.error("Admin get user details error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}