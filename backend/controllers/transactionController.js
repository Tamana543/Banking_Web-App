import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const depositMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount.",
      });
    }

    const user = await User.findById(req.user._id);

    user.balance += Number(amount);

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "deposit",
      amount,
      description: "Account Deposit",
      status: "completed",
    });

    res.status(200).json({
      success: true,
      message: "Deposit successful.",
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error("Deposit Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};