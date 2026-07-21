import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadAvatar,updateProfile,changePassword,changePin,getCurrentUser } from "../api/authApi";
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
     const [pinData, setPinData] = useState({ currentPin: "", newPin: "", confirmPin: "", });
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
     // Handle pin change 
          const handleChangePin = async () => {
              
          if (pinData.newPin !== pinData.confirmPin) {
               return setAlert({
                    type: "error",
                    message: "PINs do not match.",
               });
          }
          if (pinData.newPin.length !== 4) {
               return setAlert({
                    type: "error",
                    message: "PIN must be exactly 4 digits.",
               });
          }
          try {
               setLoading(true);
                console.log(pinData);
               await changePin(pinData);
               setAlert({
                    type: "success",
                    message:
                         "PIN updated successfully. Logging you out...",
               });
                //  To updated PIN After success 
               const userData = await getCurrentUser();
                    setUser(userData.user);
                    localStorage.setItem(
                         "user",
                         JSON.stringify(userData.user)
               );
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
              setAlert({
               type: "error",
               message: "First name is required.",
               });
               return;
          }
          if (!formData.lastName.trim()) {
               setAlert({
                    type: "error",
                    message: "Last name is required.",
                    });
               return;
          }
          if (!formData.email.trim()) {
               setAlert({
                    type: "error",
                    message: "Email is required.",
                    });
               return;
          }
          const emailRegex =
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
               setAlert({
                    type: "error",
                    message: "Please enter a valid email.",
                    });
               return;
          }
          if (
               formData.firstName === user.firstName &&
               formData.lastName === user.lastName &&
               formData.email === user.email
          ) {
               setAlert({
                    type: "error",
                    message: "No changes detected.",
                    });
               return;
          }
          try {
               setLoading(true);
               const data = await updateProfile(formData);
               setUser(data.user);
               localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
               );
               setAlert({
                    type: "success",
                    message: "Profile updated successfully.",
               });

               setTimeout(() => {
                    setEditing(false);

                    setAlert({
                         type: "",
                         message: "",
                    });
               }, 1500);
          } catch (error) {
               setAlert({
                         type: "error",
                         message: error.message,
                    });
          } finally {
               setLoading(false);
          }
          };
     const handleCancel = () => { setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, }); setEditing(false); };
    

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
                    <span
                         className={
                              user?.isVerified
                                   ? "verified"
                                   : "not-verified"
                         }
                         >
                         {user?.isVerified
                              ? "Verified Account"
                              : "Unverified Account"}
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
                    {/* Security Card */}
                    <div className="profile-info">
                         <h3>Security Center</h3>

                         <div className="info-row">
                              <span>Current Session</span>
                              <strong className="security-success">
                                   Active
                              </strong>
                         </div>

                         <div className="info-row">
                              <span>Last Login</span>

                              <strong>
                                   {
                                        user?.lastLogin
                                        ?
                                        new Date(user.lastLogin)
                                        .toLocaleString()
                                        :
                                        "Never"
                                   }
                              </strong>
                         </div>

                         <div className="info-row">
                              <span>Password Updated</span>

                              <strong>
                                   {
                                        user?.passwordUpdatedAt
                                        ?
                                        new Date(user.passwordUpdatedAt)
                                        .toLocaleDateString()
                                        :
                                        "Not yet"
                                   }
                              </strong>
                         </div>

                         <div className="info-row">
                              <span>PIN Updated</span>

                              <strong>
                                   {
                                        user?.pinUpdatedAt
                                        ?
                                        new Date(user.pinUpdatedAt)
                                        .toLocaleDateString()
                                        :
                                        "Not yet"
                                   }
                              </strong>
                         </div>

                         <div className="info-row">
                              <span>Two-Factor Authentication</span>

                              <strong className="coming-soon">
                                   Coming Soon
                              </strong>
                         </div>

                         <div className="info-row">
                              <span>Logout From All Devices</span>

                              <strong className="coming-soon">
                                   Coming Soon
                              </strong>
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
                         <AlertMessage type={alert.type} message={alert.message} />
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
