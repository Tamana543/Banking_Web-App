import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../components/common/TransactionSkeleton";
import { getContactMessages, markMessageRead, getSubscribers, } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import "../../styles/dashboard/dashboard.css";
import "../../styles/recent-transacrions.css";
import "../../styles/components/modal.css";
import "../../styles/admin.css";

function AdminMessages(){
  const { showToast } = useToast();
  const [view, setView] = useState("messages");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
   const loadItems = async () => {
    try {
      const data = view === "messages" ? await getContactMessages(page) : await getSubscribers(page);
      setItems(view === "messages" ? data.messages : data.subscribers);
      setTotal(data.total);
      setUnread(data.unread || 0);
      setPages(data.pages);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    loadItems();
  }, [view, page])
  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      await loadItems();
    } catch (error) {
      showToast(handleApiError(error), "error");
    }
  };

  const title = view === "messages" ? `Messages (${total})${unread ? ` · ${unread} unread` : ""}` : `Subscribers (${total})`;

  return(
     <DashboardLayout>
          <DashboardHeader/>
          <section className="recent-transactions" aria-labelledby="admin-messages-title">
                <h3 id="admin-messages-title">{title}</h3>
        <div className="transaction-toolbar">
          <div className="transaction-filter">
            <select
              aria-label="Choose a list"
              value={view}
              onChange={(e) => {
                setView(e.target.value);
                setPage(1);
              }}
            >
              <option value="messages">Messages</option>
              <option value="subscribers">Newsletter subscribers</option>
            </select>
          </div>
        </div>
        {loading ? (
          <TransactionSkeleton />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h4>{view === "messages" ? "No messages yet" : "No subscribers yet"}</h4>
          </div>
        ) : (
          <div className="transaction-list">
            {view === "messages"
              ? items.map((m) => (
                  <div key={m._id} className="transaction-item">
                    <div className="transaction-main">
                      <div className="transaction-category">
                        <h4>{m.name}</h4>
                      </div>
                      <span>{m.email}</span>
                      <span className="admin-message-text">{m.message}</span>
                      <small className="transaction-date">
                        {new Date(m.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="transaction-right">
                      <span
                        className={`transaction-status ${m.isRead ? "completed" : "pending"}`}
                      >
                        {m.isRead ? "Read" : "Unread"}
                      </span>
                      <div className="admin-loan-actions">
                        <a
                          className="cancel-btn"
                          href={`mailto:${encodeURIComponent(m.email)}`}
                        >
                          Reply
                        </a>
                        {!m.isRead && (
                          <button type="button" className="submit-btn" onClick={() => handleMarkRead(m._id)} > Mark as read </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : items.map((s) => (
                  <div key={s._id} className="transaction-item">
                    <div className="transaction-main">
                      <div className="transaction-category">
                        <h4>{s.email}</h4>
                      </div>
                      <small className="transaction-date">
                        Subscribed {new Date(s.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
          </div>
        )}
        {pages > 1 && (
          <div className="admin-pagination">
            <button type="button" className="cancel-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {pages}</span>
            <button type="button" className="cancel-btn" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
          </section>
     </DashboardLayout>
  )
}
export default AdminMessages;