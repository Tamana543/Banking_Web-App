import "../../styles/components/alert.css";
function AlertMessage({ type = "error", message }) {
  if (!message) return null;

  return (
    <div className={`alert-message ${type}`}>
      {message}
    </div>
  );
}

export default AlertMessage;