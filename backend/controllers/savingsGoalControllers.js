import SavingsGoal from "../models/SavingsGoal.js";
export const createSavingsGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline } = req.body;
    // Validate goal name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Savings goal name is required.",
      });
    }
    // Validate target amount
    if (
      targetAmount === undefined ||
      Number(targetAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be greater than 0.",
      });
    }
    const savingsGoal = await SavingsGoal.create({
      user: req.user._id,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      deadline: deadline || null,
    });
    res.status(201).json({
      success: true,
      message: "Savings goal created successfully.",
      savingsGoal,
    });
  } catch (error) {
    console.error("Create Savings Goal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
export const getSavingsGoals = async (req, res) => {
  try {
    const savingsGoals = await SavingsGoal.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      savingsGoals,
    });
  } catch (error) {
    console.error("Get Savings Goals Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
export const addSavingsContribution = async (req, res) => {
  try {
    const { amount } = req.body;
     if (
      amount === undefined ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Contribution amount must be greater than 0.",
      });
    }
    const contributionAmount = Number(amount);
    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!savingsGoal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found.",
      });
    }
    if (savingsGoal.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This savings goal has already been completed.",
      });
    }
    const remainingAmount = savingsGoal.targetAmount -  savingsGoal.currentAmount;
     if (contributionAmount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `You only need $${remainingAmount.toFixed(
          2
        )} to complete this goal.`,
      });
    }
    savingsGoal.currentAmount += contributionAmount;
     if (
      savingsGoal.currentAmount >=
      savingsGoal.targetAmount
    ) {
      savingsGoal.currentAmount =
        savingsGoal.targetAmount;
      savingsGoal.status = "completed";
    }
    await savingsGoal.save();
     res.status(200).json({
      success: true,
      message: "Savings contribution added successfully.",
      savingsGoal,
    });
  } catch (error) {
    console.error(
      "Add Savings Contribution Error:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
export const deleteSavingsGoal = async (req, res) => {
  try {
    const savingsGoal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!savingsGoal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found.",
      });
    }
    await savingsGoal.deleteOne();
    res.status(200).json({
      success: true,
      message: "Savings goal deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Savings Goal Error:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
