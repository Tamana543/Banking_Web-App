import User from "../models/User.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { isValidObjectId } from "../utils/inputValidation.js";
const LOAN_STATUSES = ["pending", "approved", "rejected"];

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const [users, total] = await Promise.all([
      User.find()
        .select("firstName lastName email role balance currency avatar isVerified createdAt lastLogin")
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
