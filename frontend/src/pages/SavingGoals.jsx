import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { getSavingsGoals, createSavingsGoal, } from "../api/savingsGoalApi";
import { useToast } from "../context/ToastContext";
import { getSavingsMilestone } from "../util/savingsMilestone";
import "../styles/savingsGoals.css";

function SavingsGoals() {
  const { showToast } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const milestone = getSavingsMilestone(progressPercentage);
  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getSavingsGoals();
      setGoals(data.savingsGoals);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadGoals();
  }, []);
  const handleCreateGoal = async () => {
    if (!name.trim()) {
      showToast("Enter a savings goal name.", "error");
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      showToast(
        "Enter a valid target amount.",
        "error"
      );
      return;
    }
    try {
      await createSavingsGoal(
        name,
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
      showToast(error.message, "error");
    }
  };
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="savings-goals-page">
        <div className="savings-goals-header">
          <h2>Savings Goals</h2>
          <p>
            Set targets and track your progress
            toward the things that matter to you.
          </p>
        </div>
        <div className="savings-goal-form">
          <h3>Create a Savings Goal</h3>
          <input type="text" placeholder="Goal name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" min="0" step="0.01" placeholder="Target amount" value={targetAmount} onChange={(e) =>setTargetAmount(e.target.value)} />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value) } />
          <button onClick={handleCreateGoal} >
            Create Goal
          </button>
        </div>
        <div className="savings-goals-list">
          {loading ? (
            <p>Loading savings goals...</p>
          ) : goals.length === 0 ? (
            <p>
              You don't have any savings goals yet.
            </p>
          ) : (
            goals.map((goal) => (
            <div className="savings-goal-card" key={goal._id} >
            <div className="savings-goal-card-header">
              <h3>{goal.name}</h3>
              <span className={`goal-status ${goal.status}`}>
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
                    width: `${Math.min(
                      (goal.currentAmount /
                        goal.targetAmount) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              {milestone && (
                    <div className="savings-milestone">
                      <span className="savings-milestone-icon">
                        {milestone.icon}
                      </span>

                      <div>
                        <strong>{milestone.label}</strong>
                        <p>{milestone.percentage}% milestone reached</p>
                      </div>
                    </div>
                  )}
              <div className="progress-info">
                <span>
                  {Math.min(
                    Math.round(
                      (goal.currentAmount /
                        goal.targetAmount) *
                        100
                    ),
                    100
                  )}
                  %
                </span>
                <span>
                  ${goal.currentAmount.toLocaleString()} saved
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
          </div>
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
export default SavingsGoals;