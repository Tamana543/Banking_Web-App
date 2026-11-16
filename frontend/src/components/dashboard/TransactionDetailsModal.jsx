import { useEffect, useState } from "react";
import { updateTransactionTags } from "../../api/transactionApi";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import "../../styles/components/transaction_details_modal.css"
import { generateTransactionId } from "../../util/transactionId";

const getCategory = (type) => {
    switch (type) {

        case "deposit":
            return {
                color: "deposit",
                label: "Deposit",
            };

        case "withdrawal":
            return {
                color: "withdrawal",
                label: "Withdrawal",
            };

        case "transfer":
            return {
                color: "transfer",
                label: "Transfer",
            };

        case "loan":
            return {
                color: "loan",
                label: "Loan",
            };

        default:
            return {
                color: "default",
                label: type,
            };
    }
};
function TransactionDetailsModal({ transaction, isOpen, onClose, onTagsUpdated, }) {
  const { showToast } = useToast();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [savingTags, setSavingTags] = useState(false);

  useEffect(() => {
    setTags(transaction?.tags || []);
    setTagInput("");
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const saveTags = async (nextTags) => {
    try {
      setSavingTags(true);
      const data = await updateTransactionTags(transaction._id, nextTags);
      setTags(data.transaction.tags);
      onTagsUpdated?.(data.transaction);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setSavingTags(false);
    }
  };
  const addTag = () => {
    const value = tagInput.trim().toLowerCase();
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    if (tags.length >= 5) {
      showToast("You can add up to 5 tags.", "error");
      return;
    }
    setTagInput("");
    saveTags([...tags, value]);
  };

  const removeTag = (tag) => saveTags(tags.filter((t) => t !== tag));
  const category = getCategory(transaction.type);
  return (
    <div className="modal-overlay" onClick={onClose} >
      <div className="transaction-modal" onClick={(e) => e.stopPropagation()} >
        <h2>Transaction Details</h2>

       <div className="detail-row">
            <span>Category</span>

            <strong className={`category-text ${category.color}`}>
                {category.label}
            </strong>
        </div>

        <div className="detail-row">
          <span>Amount</span>
          <strong>
            $
            {Number(transaction.amount).toLocaleString()}
          </strong>
        </div>

        <div className="detail-row">
          <span>Status</span>

          <strong className={`status ${transaction.status.toLowerCase()}`}>
            {transaction.status}
          </strong>
        </div>

        <div className="detail-row">
          <span>Description</span>

          <strong>
            {transaction.description}
          </strong>
        </div>

        <div className="detail-row">
          <span>Date</span>

          <strong>
            {new Date(
              transaction.createdAt
            ).toLocaleString()}
          </strong>
        </div>

        <div className="detail-row">
               <span>Transaction ID</span>

               <strong className="transaction-id">
                    {generateTransactionId(transaction._id)}
               </strong>
          </div>

        <button className="transaction-close-btn" onClick={onClose} > Close </button>
                    <div className="detail-row detail-tags">
          <span>Tags</span>
          <div className="tag-editor">
            <div className="tag-list">
              {tags.length === 0 && (
                <small className="tag-empty">No tags yet</small>
              )}
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button type="button" className="tag-remove" aria-label={`Remove tag ${tag}`} disabled={savingTags} onClick={() => removeTag(tag)} > × </button>
                </span>
              ))}
            </div>
            <div className="tag-input-row">
              <input type="text" value={tagInput} maxLength={20} placeholder="Add a tag, e.g. groceries" aria-label="New tag" disabled={savingTags} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
              <button type="button" className="tag-add" onClick={addTag} disabled={savingTags || !tagInput.trim()} > Add </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;