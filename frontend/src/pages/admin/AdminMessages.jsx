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
          </section>
     </DashboardLayout>
  )
}
export default AdminMessages;