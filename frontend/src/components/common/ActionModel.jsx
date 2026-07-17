import "../../styles/components/modal.css"
import { useEffect } from "react";
function ActionModal({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitText,
  loading = false
}) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleEsc = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };
    document.addEventListener(
        "keydown",
        handleEsc
    );
    return () =>
        document.removeEventListener(
            "keydown",
            handleEsc
        );
}, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
              className="submit-btn"
              onClick={onSubmit}
              disabled={loading}
          >
              {
                  loading
                      ? "Saving..."
                      : submitText
              }
          </button>
        </div>
      </div>
    </div>
  );
}
export default ActionModal;