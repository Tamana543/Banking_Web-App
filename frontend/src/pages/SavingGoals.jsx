import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import {
  getSavingsGoals,
  createSavingsGoal,
  addSavingsContribution,
} from "../api/savingsGoalApi";
import { useToast } from "../context/ToastContext";
import { getSavingsMilestone } from "../util/savingsMilestone";
import "../styles/savingsGoals.css";
function SavingsGoals() {
  const { showToast } = useToast();
  // =========================
  // Savings Goals
  // =========================
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  // =========================
  // Create Goal
  // =========================
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  // =========================
  // Add Money Modal
  // =========================
  const [showContributionModal, setShowContributionModal] =
    useState(false);
  const [selectedGoal, setSelectedGoal] =
    useState(null);
  const [contributionAmount, setContributionAmount] =
    useState("");
  const [contributionLoading, setContributionLoading] =
    useState(false);
  // =========================
  // Load Goals
  // =========================
  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getSavingsGoals();
      setGoals(data.savingsGoals || []);
    } catch (error) {
      showToast(
        error.message || "Failed to load savings goals.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadGoals();
  }, []);
  // =========================
  // Create Goal
  // =========================
  const handleCreateGoal = async () => {
    if (!name.trim()) {
      showToast(
        "Enter a savings goal name.",
        "error"
      );
      return;
    }
    if (
      !targetAmount ||
      Number(targetAmount) <= 0
    ) {
      showToast(
        "Enter a valid target amount.",
        "error"
      );
      return;
    }
    try {
      await createSavingsGoal(
        name.trim(),
        Number(targetAmount),
        deadline
      );
      showToast(
        "Savings goal created successfully.",
        "success"
      );
      setName("");
      setTargetAmount("");
      setDeadline("");
      await loadGoals();
    } catch (error) {
      showToast(
        error.message || "Failed to create savings goal.",
        "error"
      );
    }
  };
  // =========================
  // Open Add Money Modal
  // =========================
  const openContributionModal = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount("");
    setShowContributionModal(true);
  };
  // =========================
  // Close Add Money Modal
  // =========================
  const closeContributionModal = () => {
    setShowContributionModal(false);
    setSelectedGoal(null);
    setContributionAmount("");
  };
  // =========================
  // Add Money
  // =========================
  const handleAddMoney = async () => {
    if (
      !contributionAmount ||
      Number(contributionAmount) <= 0
    ) {
      showToast(
        "Enter a valid amount.",
        "error"
      );
      return;
    }
    if (!selectedGoal) {
      return;
    }
    const remainingAmount =
      selectedGoal.targetAmount -
      selectedGoal.currentAmount;
    if (
      Number(contributionAmount) >
      remainingAmount
    ) {
      showToast(
        `You only need $${remainingAmount.toLocaleString()} to complete this goal.`,
        "error"
      );
      return;
    }
    try {
      setContributionLoading(true);
      await addSavingsContribution(
        selectedGoal._id,
        Number(contributionAmount)
      );
      showToast(
        "Money added to your savings goal.",
        "success"
      );
      closeContributionModal();
      // Reload goals so the progress bar
      // receives the new currentAmount.
      await loadGoals();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to add money to savings goal.",
        "error"
      );
    } finally {
      setContributionLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="savings-goals-page">
        {/* =========================
            Page Header
        ========================== */}
        <div className="savings-goals-header">
          <h2>Savings Goals</h2>
          <p>
            Set targets and track your progress
            toward the things that matter to you.
          </p>
        </div>
        {/* =========================
            Create Goal
        ========================== */}
        <div className="savings-goal-form">
          <h3>Create a Savings Goal</h3>
          <input type="text" placeholder="Goal name" value={name} onChange={(e) => setName(e.target.value) } />
          <input type="number" min="0" step="0.01" placeholder="Target amount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value) } />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value) } />
          <button onClick={handleCreateGoal} >
            Create Goal
          </button>
        </div>
        

        <div className="savings-goals-list">
          {loading ? (
            <p>
              Loading savings goals...
            </p>
          ) : goals.length === 0 ? (
            <p>
              You don't have any savings goals yet.
            </p>
          ) : (
            goals.map((goal) => {
              const progressPercentage =
                Math.min(
                  (
                    goal.currentAmount /
                    goal.targetAmount
                  ) * 100,
                  100
                );
              const milestone =
                getSavingsMilestone(
                  progressPercentage
                );
              return (
                <div className="savings-goal-card" key={goal._id} >
                  <div className="savings-goal-card-header">
                    <h3>
                      {goal.name}
                    </h3>
                    <span
                      className={`goal-status ${goal.status}`}
                    >
                      {goal.status}
                    </span>
                  </div>
                
                  <div className="savings-goal-amounts">
                    <p>
                      Saved:{" "}
                      <strong>
                        ${goal.currentAmount.toLocaleString()}
                      </strong>
                    </p>
                    <p>
                      Target:{" "}
                      <strong>
                        ${goal.targetAmount.toLocaleString()}
                      </strong>
                    </p>
                  </div>
                  
                  <div className="savings-goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progressPercentage}%`,
                        }}
                      />
                    </div>
                
                    {milestone && (
                      <div className="savings-milestone">
                        <span className="savings-milestone-icon">
                          {milestone.icon}
                        </span>
                        <div>
                          <strong>
                            {milestone.label}
                          </strong>
                          <p>
                            {milestone.percentage}%
                            milestone reached
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="progress-info">
                      <span>
                        {Math.round(
                          progressPercentage
                        )}
                        %
                      </span>
                      <span>
                        $
                        {goal.currentAmount.toLocaleString()}
                        {" "}saved
                      </span>
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <p className="savings-goal-deadline">
                      Deadline:{" "}
                      {new Date(
                        goal.deadline
                      ).toLocaleDateString()}
                    </p>
                  )}
                  
                  {goal.status !== "completed" && (
                    <button
                      className="add-money-btn"
                      onClick={() =>
                        openContributionModal(goal)
                      }
                    >
                      + Add Money
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
      
      {showContributionModal && selectedGoal && (
        <div className="contribution-modal-overlay">
          <div className="contribution-modal">
            <button className="contribution-modal-close" onClick={closeContributionModal} disabled={contributionLoading} >
              ×
            </button>
            <h3>
              Add Money
            </h3>
            <p>
              Add money to{" "}
              <strong>
                {selectedGoal.name}
              </strong>
            </p>
            <div className="contribution-current">
              <span>
                Current savings
              </span>
              <strong>
                ${selectedGoal.currentAmount.toLocaleString()}
              </strong>
            </div>
            <div className="contribution-target">
              <span>
                Target
              </span>
              <strong>
                ${selectedGoal.targetAmount.toLocaleString()}
              </strong>
            </div>
            <input type="number" min="0.01" step="0.01" placeholder="Enter amount" value={contributionAmount} onChange={(e) => setContributionAmount( e.target.value ) }
              disabled={contributionLoading}
            />
            <button className="contribution-submit-btn" onClick={handleAddMoney} disabled={contributionLoading} >
              {contributionLoading
                ? "Adding..."
                : "Add Money"}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default SavingsGoals;