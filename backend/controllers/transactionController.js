import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const depositMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const amountNumber = Number(amount)

    if (!amountNumber || amountNumber <= 0) {
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


export const transferMoney = async (req,res)=>{
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
  try {
    const { recipientEmail, amount } = req.body;
    const amountNumber = Number(amount);

    if (!recipientEmail || !amountNumber) {
      return res.status(400).json({
        success: false,
        message: "Recipient email and amount are required.",
      });
    }

    if (amountNumber <= 0) {
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

    if (sender.balance < amountNumber) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

     sender.balance -= amountNumber;
    receiver.balance += amountNumber;
    // special ID generator 
    const transactionId =
  "TX-" +
  senderTransaction._id
    .toString()
    .slice(-8)
    .toUpperCase();


    await sender.save();
    await receiver.save();

     const senderTransaction = await Transaction.create({
      user: sender._id,
      type: "transfer",
      amount: amountNumber,
      description: `Transfer sent to ${receiver.email}`,
      status: "completed",
    });

      res.status(200).json({
        success: true,
        message: "Transfer successful.",
        balance: sender.balance,
        receipt: {
            transactionId,
            recipient: receiver.email,
            amount: amountNumber,
            status: "Completed",
            date: senderTransaction.createdAt,
        },
      });

  } catch (error) {
    console.error("Transfer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

export const withdrawMoney = async(req,res)=>{
  try {
     const { amount } = req.body;
    const amountNumber = Number(amount);

    if (!amountNumber || amountNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount.",
      });
    }

      const user = await User.findById(req.user._id);

    if (user.balance < amountNumber) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    user.balance -= amountNumber

    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "withdrawal",
      amount :amountNumber,
      description: "Cash Withdrawal",
      status: "completed",
    });

    res.status(200).json({
      success: true,
      message: "Withdrawal successful.",
      balance: user.balance,
      transaction,
    });
  } catch (error) {
     console.error("Withdraw Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
