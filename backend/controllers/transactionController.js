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

export const getTransactions = async (req,res)=>{
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

/**
 * Conditions for transfer : 
 Sender must exist
Receiver must exist
Sender cannot transfer to themselves
Amount must be greater than 0
Sender must have enough balance
Deduct sender balance
Add receiver balance
Create sender transaction
Create receiver transaction
 */

export const transferMoney = async (req,res)=>{
  try {
    const { recipientEmail, amount } = req.body;

    if (!recipientEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: "Recipient email and amount are required.",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero.",
      });
    }
     const sender = await User.findById(req.user._id);

    const receiver = await User.findOne({
      email: recipientEmail.toLowerCase().trim(),
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found.",
      });
    }

    if (String(sender._id) === String(receiver._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot transfer money to yourself.",
      });
    }

    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

     sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    await Transaction.create({
      user: sender._id,
      type: "transfer",
      amount,
      description: `Transfer sent to ${receiver.email}`,
      status: "completed",
    });
    await Transaction.create({
        user: receiver._id,
        type: "transfer",
        amount,
        description: `Transfer received from ${sender.email}`,
        status: "completed",
      });

      res.status(200).json({
        success: true,
        message: "Transfer successful.",
        balance: sender.balance,
      });

  } catch (error) {
    console.error("Transfer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
