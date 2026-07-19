import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadAvatar,updateProfile,changePassword,changePin } from "../api/authApi";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ActionModal from "../components/common/ActionModel";
import AlertMessage from "../components/common/AlertMessage";
import "../styles/profile.css";
function Profile() {
     // states 
     const {user,setUser,logout} = useAuth();
     const navigate= useNavigate();
     const [editing, setEditing] = useState(false);
     const [formData, setFormData] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", });
     const [loading, setLoading] = useState(false);
     const [showPasswordModal, setShowPasswordModal] = useState(false)
     const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "",});
     const [showPinModal, setShowPinModal] = useState(false)
     const [pinData, setPinDate] = useState({currentPassword:"",newPin:"",confirmPin:""})
     const [alert, setAlert] = useState({ type: "", message: "", });
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
     const handlePasswordChange = (e) => { setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value, })); };// handles input 
     const handlePinChange = (e) => { setPinData((prev) => ({ ...prev, [e.target.name]: e.target.value, })); };
     // handle password saving 
     const handleChangePassword = async () => {
          try {
               setLoading(true);
               await changePassword(passwordData);
               setAlert({
                    type: "success",
                    message:
                         "Password updated successfully. Logging you out...",
               });
               setTimeout(() => {
                    logout();
                    navigate("/login");
               }, 1800);
          } catch (error) {
               setAlert({
                    type: "error",
                    message: error.message,
               });
          } finally {
               setLoading(false);
          }
          };
     //Profile change
     const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value, }); };
     // Profile overall save
     const handleSave = async () => {
          if (!formData.firstName.trim()) {
               return alert("First name is required.");
          }
          if (!formData.lastName.trim()) {
               return alert("Last name is required.");
          }
          if (!formData.email.trim()) {
               return alert("Email is required.");
          }
          const emailRegex =
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
               return alert("Please enter a valid email.");
          }
          if (
               formData.firstName === user.firstName &&
               formData.lastName === user.lastName &&
               formData.email === user.email
          ) {
               return alert("No changes detected.");
          }
          try {
               setLoading(true);
               const data = await updateProfile(formData);
               setUser(data.user);
               localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
               );
               setEditing(false);
          } catch (error) {
               alert(error.message);
          } finally {
               setLoading(false);
          }
          };
     const handleCancel = () => { setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, }); setEditing(false); };
     const handleChangePin = async () => { console.log(pinData); };
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
                    <button className="edit-profile-btn" onClick={() => setEditing(true)} > Edit Profile </button>
                    <button className="profile-btn" onClick={() => setShowPasswordModal(true) } > Change Password </button>
                    <button className="profile-btn" onClick={() => setShowPinModal(true)} > Change PIN </button>
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
            <ActionModal
                    isOpen={editing}
                    title="Edit Profile"
                    submitText="Save Changes"
                    onClose={handleCancel}
                    onSubmit={handleSave}
                    loading={loading}
                    >
                    <div className="profile-form">
                         <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                         <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                         <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    </div>
                    </ActionModal>
                    {/* password change model */}
                    <ActionModal isOpen={showPasswordModal} title="Change Password" submitText="Update Password" loading={loading}
                     onClose={() => {setShowPasswordModal(false); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "",});
                    setAlert({ type: "", message: "", });}} onSubmit={handleChangePassword} >
                         <input type="password" name="currentPassword" placeholder="Current Password" value={passwordData.currentPassword} onChange={handlePasswordChange}/>
                         <input type="password" name="newPassword" placeholder="New Password" value={passwordData.newPassword} onChange={handlePasswordChange}/>
                         <input type="password" name="confirmPassword" placeholder="Confirm Password" value={passwordData.confirmPassword} onChange={handlePasswordChange}/>
                         <AlertMessage type={alert.type} message={alert.message} />
                    </ActionModal>
                    <ActionModal
                         isOpen={showPinModal}
                         title="Change PIN"
                         submitText="Update PIN"
                         loading={loading}
                         onClose={() => {
                              setShowPinModal(false);
                              setPinData({
                                   currentPin: "",
                                   newPin: "",
                                   confirmPin: "",
                              });
                              setAlert({
                                   type: "",
                                   message: "",
                              });
                         }}
                         onSubmit={handleChangePin}
                         >
                         <input
                              type="password"
                              name="currentPin"
                              placeholder="Current PIN"
                              value={pinData.currentPin}
                              onChange={handlePinChange}
                         />
                         <input
                              type="password"
                              name="newPin"
                              placeholder="New PIN"
                              value={pinData.newPin}
                              onChange={handlePinChange}
                         />
                         <input
                              type="password"
                              name="confirmPin"
                              placeholder="Confirm PIN"
                              value={pinData.confirmPin}
                              onChange={handlePinChange}
                         />
                         <AlertMessage
                              type={alert.type}
                              message={alert.message}
                         />
                    </ActionModal>
        </DashboardLayout>
    );
}
export default Profile;
