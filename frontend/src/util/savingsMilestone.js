export const getSavingsMilestone = (percentage) => {
  if (percentage >= 100) {
    return {
      percentage: 100,
      label: "Goal Completed",
      icon: "✨",
    };
  }
  if (percentage >= 75) {
    return {
      percentage: 75,
      label: "Almost There",
      icon: "🔥",
    };
  }
  if (percentage >= 50) {
    return {
      percentage: 50,
      label: "Halfway There",
      icon: "⭐",
    };
  }
  if (percentage >= 25) {
    return {
      percentage: 25,
      label: "First Milestone",
      icon: "🎯",
    };
  }
  return null;
};