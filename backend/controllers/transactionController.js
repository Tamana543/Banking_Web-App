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

export const getTransactions = async (re,res)=>{
   try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};