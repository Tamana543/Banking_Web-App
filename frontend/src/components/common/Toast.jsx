import "../../styles/components/toast.css";
function Toast({
    type = "success",
    message,
    isVisible,
}) {
    if (!isVisible || !message) return null;
    return (
        <div
            className={`toast ${type}`}
            role="status"
            aria-live={type === "error" ? "assertive" : "polite"}
            aria-atomic="true"
        >
            <span>{message}</span>
        </div>
    );
}
export default Toast;