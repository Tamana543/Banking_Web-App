function ActionModal({
  isOpen,
  title,
  children,
  onClose,
  onSubmit,
  submitText,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="action-modal">

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
          >
            {submitText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ActionModal;