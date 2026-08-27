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
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: savingsGoals.length,
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