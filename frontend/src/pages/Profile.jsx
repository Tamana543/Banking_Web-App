import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { uploadAvatar } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

function Profile() {
     const {user,setUser} = useAuth();
     const handleAvatarChange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          try {
               const data = await uploadAvatar(file);
               const updatedUser = {
                    ...user,
                    avatar: data.avatar,
               };
               setUser(updatedUser);
               localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
               );
          } catch (error) {
               alert(error.message);
          }
     };
     return (
        <DashboardLayout>
            <DashboardHeader />
            <section className="profile-page">
                <div className="profile-card">
                    <div className="profile-avatar">
                         <label htmlFor="avatarUpload">
                         {user?.avatar ? (
                              <img
                              src={`http://localhost:5000${user.avatar}`}
                              alt="avatar"
                              />
                         ) : (
                              <span>
                              {user?.firstName?.charAt(0)}
                              </span>
                         )}
                         </label>
                         <input
                         id="avatarUpload"
                         type="file"
                         accept="image/*"
                         hidden
                         onChange={handleAvatarChange}
                         />
                         </div>
                    <h2>{user?.firstName} {user?.lastName}</h2>
                    <p>{user?.email}</p>
                    <span className="verified">
                        Verified Account
                    </span>
                </div>
                <div className="profile-info">
                    <h3>Personal Information</h3>
                    <div className="info-row">
                         <span>Full Name</span>
                         <strong>
                              {user?.firstName} {user?.lastName}
                         </strong>
                    </div>
                    <div className="info-row">
                         <span>Email</span>
                         <strong>{user?.email}</strong>
                    </div>
                    <div className="info-row">
                         <span>Current Balance</span>
                         <strong>
                              ${Number(user?.balance || 0).toLocaleString()}
                         </strong>
                    </div>
                    <div className="info-row">
                         <span>Role</span>
                         <strong>{user?.role}</strong>
                    </div>
                    <div className="info-row">
                         <span>Currency</span>
                         <strong>{user?.currency}</strong>
                    </div>
                    <div className="info-row">
                         <span>Verified</span>
                         <strong>
                              {user?.isVerified ? "Yes" : "No"}
                         </strong>
                    </div>
               </div>
                    <div className="profile-info">
                         <h3>Account Statistics</h3>
                         <div className="info-row">
                              <span>Member Since</span>
                              <strong>
                                   {new Date(user?.createdAt).toLocaleDateString()}
                              
                              </strong>
                         </div>
                         <div className="info-row">
                              <span>Account Type</span>
                              <strong>Personal</strong>
                         </div>
                         <div className="info-row">
                              <span>Status</span>
                              <strong>Active</strong>
                         </div>
                    </div>
            </section>
        </DashboardLayout>
    );
}
export default Profile;
