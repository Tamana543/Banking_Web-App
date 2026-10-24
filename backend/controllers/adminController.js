import User from "../models/User.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import SavingsGoal from "../models/SavingsGoal.js";
import { isValidObjectId } from "../utils/inputValidation.js";
import AuditLog from "../models/AuditLog.js";
const recordAudit = async (entry, session = null) => {
  if (session) {
    await AuditLog.create([entry], { session });
    return;
  }
  try {
    await AuditLog.create(entry);
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
};
const LOAN_STATUSES = ["pending", "approved", "rejected"];
const TRANSACTION_TYPES = ["deposit", "withdrawal", "transfer", "loan"];
const TRANSACTION_STATUSES = ["pending", "completed", "failed", "approved", "rejected"];
const ALLOWED_RANGES = [7, 30, 90];

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
      const status = req.query.status;
    if (status !== undefined) {
      if (status === "outstanding") {
        filter.status = "approved";
        filter.repaidAt = null;
      } else if (status === "repaid") {
        filter.status = "approved";
        filter.repaidAt = { $ne: null };
      } else if (LOAN_STATUSES.includes(status)) {
        filter.status = status;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }
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
       if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const stats = {
      deposit: { count: 0, total: 0 },
      withdrawal: { count: 0, total: 0 },
      transfer: { count: 0, total: 0 },
      loan: { count: 0, total: 0 },
    };
    totals.forEach((row) => {
      if (stats[row._id]) {
        stats[row._id] = { count: row.count, total: row.total };
      }
    });

    res.status(200).json({
      success: true,
      user,
      stats,
      recentTransactions,
      loans,
      savingsGoals,
    });
  } catch (error) {
    console.error("Admin get user details error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export const getPlatformStats = async (req, res) => {
  try {
     const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const customers = { role: { $ne: "admin" } };
    const [ totalUsers, suspendedUsers, lockedUsers, newUsersThisMonth, balanceAgg, totalTransactions, transactionsToday, monthAgg, pendingLoanAgg, approvedLoanAgg,outstandingLoanAgg ] = await Promise.all([
      User.countDocuments(customers),
      User.countDocuments({ ...customers, isSuspended: true }),
      User.countDocuments({
        ...customers,
        isSuspended: false,
        $or: [
          { lockUntil: { $gt: now } },
          { pinLockedUntil: { $gt: now } },
        ],
      }),
      User.countDocuments({ ...customers, createdAt: { $gte: startOfMonth } }),
      User.aggregate([
        { $match: customers },
        { $group: { _id: null, total: { $sum: "$balance" } } },
      ]),
      Transaction.countDocuments(),
      Transaction.countDocuments({ createdAt: { $gte: startOfToday } }),
      Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
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
      ]),
      Transaction.aggregate([
        { $match: { type: "loan", status: "pending" } },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "loan", status: "approved" } },
        { $group: { _id: null, count: { $sum: 1 }, total: { $sum: "$amount" } } },
      ]),
            Transaction.aggregate([
        { $match: { type: "loan", status: "approved", repaidAt: null } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: {
              $sum: {
                $subtract: ["$amount", { $ifNull: ["$repaidAmount", 0] }],
              },
            },
          },
        },
      ]),
    ]);
    const month = {
      deposit: { count: 0, total: 0 },
      withdrawal: { count: 0, total: 0 },
      transfer: { count: 0, total: 0 },
      loan: { count: 0, total: 0 },
    };
    monthAgg.forEach((row) => {
      if (month[row._id]) {
        month[row._id] = { count: row.count, total: row.total };
      }
    });

    res.status(200).json({
      success: true,
      users: {
        total: totalUsers,
        suspended: suspendedUsers,
        locked: lockedUsers,
        newThisMonth: newUsersThisMonth,
        totalBalance: balanceAgg[0]?.total || 0,
      },
      transactions: {
        total: totalTransactions,
        today: transactionsToday,
        month,
      },
      loans: {
        pending: {
          count: pendingLoanAgg[0]?.count || 0,
          total: pendingLoanAgg[0]?.total || 0,
        },
        approved: {
          count: approvedLoanAgg[0]?.count || 0,
          total: approvedLoanAgg[0]?.total || 0,
        },
        outstanding: {
          count: outstandingLoanAgg[0]?.count || 0,
          total: outstandingLoanAgg[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    console.error("Admin platform stats error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export const getPlatformAnalytics = async (req, res) => {
  try {
    const days = Number(req.query.days ?? 30);
    if (!ALLOWED_RANGES.includes(days)) {
      return res.status(400).json({
        success: false,
        message: "Invalid range.",
      });
    }
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const dayExpr = {
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
    };
    const [signups, moved, loanStatuses] = await Promise.all([
      User.aggregate([
        {
          $match: {
            role: { $ne: "admin" },
            createdAt: { $gte: since },
          },
        },
        { $group: { _id: dayExpr, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: since },
            status: { $in: ["completed", "approved"] },
          },
        },
        {
          $group: {
            _id: { day: dayExpr, type: "$type" },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { type: "loan", createdAt: { $gte: since } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);
     const series = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      series.push({
        date: d.toISOString().slice(0, 10),
        newUsers: 0,
        deposits: 0,
        withdrawals: 0,
        transfers: 0,
      });
    }
    const indexByDate = Object.fromEntries(
      series.map((row, i) => [row.date, i])
    );

    signups.forEach((row) => {
      const i = indexByDate[row._id];
      if (i !== undefined) series[i].newUsers = row.count;
    });

    const seriesKey = {
      deposit: "deposits",
      withdrawal: "withdrawals",
      transfer: "transfers",
    };
    const typeCounts = { deposit: 0, withdrawal: 0, transfer: 0, loan: 0 };
    moved.forEach((row) => {
      const i = indexByDate[row._id.day];
      if (i !== undefined && seriesKey[row._id.type]) {
        series[i][seriesKey[row._id.type]] = row.total;
      }
      if (typeCounts[row._id.type] !== undefined) {
        typeCounts[row._id.type] += row.count;
      }
    });

    const loans = {
      pending: { count: 0, total: 0 },
      approved: { count: 0, total: 0 },
      rejected: { count: 0, total: 0 },
    };
    loanStatuses.forEach((row) => {
      if (loans[row._id]) {
        loans[row._id] = { count: row.count, total: row.total };
      }
    });

    res.status(200).json({ success: true, days, series, typeCounts, loans });
  }catch (error) {
    console.error("Admin platform analytics error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}