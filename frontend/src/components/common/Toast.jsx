import "../../styles/components/toast.css";
function Toast({
    type = "success",
    message,
    isVisible,
}) {
    if (!isVisible || !message) return null;
    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
        </div>
    );
}
export default Toast;