import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { uploadAvatar, updateProfile, changePassword, changePin, } from "../api/authApi";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ActionModal from "../components/common/ActionModel";
import useApiAction from "../hooks/useApiAction";
import { isEmpty, isValidEmail, isPin, } from "../util/validation";
import { validatePassword } from "../util/passwordPolicy";
import "../styles/profile.css";
function Profile() {
  const { user, setUser, logout, } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [editing, setEditing] =
    useState(false);
  const [formData, setFormData] =
    useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", });
  const [ showPasswordModal, setShowPasswordModal, ] = useState(false);
  const [ passwordData, setPasswordData, ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [ showPinModal, setShowPinModal, ] = useState(false);
  const [pinData, setPinData] =
    useState({
      currentPin: "",
      newPin: "",
      confirmPin: "",
    });
  const { execute: executeAvatar, loading: avatarLoading, } = useApiAction();
  const { execute: executePassword, loading: passwordLoading,
  } = useApiAction();
  const {
    execute: executePin,
    loading: pinLoading,
  } = useApiAction();
  const {
    execute: executeProfile,
    loading: profileLoading,
  } = useApiAction();
  const updateStoredUser = (
    updatedUser
  ) => {
    setUser(updatedUser);
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };
  const handleAvatarChange =
    async (e) => {
      const file =
        e.target.files?.[0];
      if (!file) return;
      const data =
        await executeAvatar(
          () => uploadAvatar(file),
          "Profile photo updated successfully."
        );
      if (!data) return;
      updateStoredUser({
        ...user,
        avatar: data.avatar,
      });
    };
  const handlePasswordChange = (
    e
  ) => {
    const { name, value } =
      e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const openPasswordModal = () => {
    resetPasswordForm();
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => {
    if (passwordLoading) return;
    setShowPasswordModal(false);
    resetPasswordForm();
  };
  const handleChangePassword =
    async () => {
      if ( !passwordData.currentPassword ) {
        showToast(
          "Current password is required.",
          "error"
        );
        return;
      }
      const passwordError =
        validatePassword(
          passwordData.newPassword
        );
      if (passwordError) {
          showToast(
          passwordError,
          "error"
          );
        return;
      }
      if (!passwordData.confirmPassword ) {
        showToast(
          "Please confirm your new password.",
          "error"
        );
        return;
      }
      if ( passwordData.newPassword !== passwordData.confirmPassword ) {
        showToast(
          "Passwords do not match.",
          "error"
        );
        return;
      }
      if ( passwordData.currentPassword === passwordData.newPassword ) {
        showToast(
          "New password must be different from the current password.",
          "error"
        );
        return;
      }
      const data =
        await executePassword(
          () =>
            changePassword(
              passwordData
            ),
          "Password updated successfully. Logging you out..."
        );
      if (!data) return;
          resetPasswordForm();
          setTimeout(() => {
          logout();
          navigate( "/login", { replace: true }
          );
      }, 1800);
    };
  const handlePinChange = (e) => {
    const { name, value } =
      e.target;
    const numericValue = value
      .replace(/\D/g, "")
      .slice(0, 4);
    setPinData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };
  const resetPinForm = () => {
    setPinData({
      currentPin: "",
      newPin: "",
      confirmPin: "",
    });
  };
  const openPinModal = () => {
    resetPinForm();
    setShowPinModal(true);
  };
  const closePinModal = () => {
    if (pinLoading) return;
    setShowPinModal(false);
    resetPinForm();
  };
  const handleChangePin =
    async () => {
      if (!pinData.currentPin) {
        showToast(
          "Current PIN is required.",
          "error"
        );
        return;
      }
      if (!isPin(pinData.currentPin)) {
        showToast(
          "Current PIN must contain 4 digits.",
          "error"
        );
        return;
      }
      if (!pinData.newPin) {
        showToast(
          "New PIN is required.",
          "error"
        );
        return;
      }
      if (!isPin(pinData.newPin)) {
        showToast(
          "PIN must contain 4 digits.",
          "error"
        );
        return;
      }
      if ( pinData.newPin !== pinData.confirmPin ) {
        showToast(
          "PINs do not match.",
          "error"
        );
        return;
      }
      if ( pinData.currentPin === pinData.newPin ) {
        showToast(
          "New PIN must be different from the current PIN.",
          "error"
        );
        return;
      }
      const data =
        await executePin(
          () => changePin(pinData),
          "PIN updated successfully."
        );
      if (!data) return;
      setShowPinModal(false);
      resetPinForm();
    };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };
  const handleSave = async () => {
    if ( !formData.firstName.trim() ) {
      showToast(
        "First name is required.",
        "error"
      );
      return;
    }
    if ( !formData.lastName.trim() ) {
      showToast(
        "Last name is required.",
        "error"
      );
      return;
    }
    if (isEmpty(formData.email)) {
      showToast(
        "Email is required.",
        "error"
      );
      return;
    }
    if ( !isValidEmail( formData.email) ) {
      showToast(
        "Please enter a valid email.",
        "error"
      );
      return;
    }
    if ( formData.firstName === user.firstName && formData.lastName === user.lastName && formData.email === user.email ) {
      showToast(
        "No changes detected.",
        "error"
      );
      return;
    }
    const data =
      await executeProfile(
        () =>
          updateProfile(
            formData
          ),
        "Profile updated successfully."
      );
    if (!data) return;
    updateStoredUser(
      data.user
    );
    setEditing(false);
  };
  const handleCancel = () => {
    if (profileLoading) return;
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, });
    setEditing(false);
  };
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">
            <label htmlFor="avatarUpload">
              {user?.avatar ? (
                <img src={`http://localhost:5000${user.avatar}`} alt={`${user?.firstName || "User"} profile`} />
              ) : (
                <span> {user?.firstName?.charAt( 0 )} </span>
              )}
            </label>
          </div>
          <input id="avatarUpload" type="file" accept="image/*" hidden disabled={avatarLoading} onChange={ handleAvatarChange } />
          <h2>
            {user?.firstName}{" "}
            {user?.lastName}
          </h2>
          <p>{user?.email}</p>
          <span className={ user?.isVerified ? "verified" : "not-verified" }> {user?.isVerified ? "Verified Account" : "Unverified Account"}
          </span>
        </div>
        <div className="profile-info">
          <h3>
            Personal Information
          </h3>
          <button className="edit-profile-btn" onClick={() =>setEditing(true) }> Edit Profile</button>
          <button className="profile-btn" onClick={ openPasswordModal } > Change Password </button>
          <button className="profile-btn" onClick={openPinModal} > Change PIN </button>
          <div className="info-row">
            <span>Full Name</span> <strong>{user?.firstName}{" "}{user?.lastName} </strong>
          </div>
          <div className="info-row">
            <span>Email</span>
            <strong>
              {user?.email}
            </strong>
          </div>
          <div className="info-row">
            <span>
              Current Balance
            </span>
            <strong> $ {Number( user?.balance || 0 ).toLocaleString()} </strong>
          </div>
          <div className="info-row">
            <span>Role</span>
            <strong>
              {user?.role}
            </strong>
          </div>
          <div className="info-row">
            <span>Currency</span>
            <strong>
              {user?.currency}
            </strong>
          </div>
          <div className="info-row">
            <span>Verified</span>
            <strong>
              {user?.isVerified
                ? "Yes"
                : "No"}
            </strong>
          </div>
        </div>
        <div className="profile-info">
          <h3>
            Account Statistics
          </h3>
          <div className="info-row">
            <span>
              Member Since
            </span>
            <strong>
              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "Unknown"}
            </strong>
          </div>
          <div className="info-row">
            <span>
              Account Type
            </span>
            <strong>
              Personal
            </strong>
          </div>
          <div className="info-row">
            <span>Status</span>
            <strong>Active</strong>
          </div>
        </div>
        <div className="profile-info">
          <h3>
            Security Center
          </h3>
          <div className="info-row">
            <span>
              Current Session
            </span>
            <strong className="security-success">
              Active
            </strong>
          </div>
          <div className="info-row">
            <span>
              Last Login
            </span>
            <strong>
              {user?.lastLogin
                ? new Date(
                    user.lastLogin
                  ).toLocaleString()
                : "Never"}
            </strong>
          </div>
          <div className="info-row">
            <span>
              Password Updated
            </span>
            <strong>
              {user?.passwordUpdatedAt
                ? new Date(
                    user.passwordUpdatedAt
                  ).toLocaleDateString()
                : "Not yet"}
            </strong>
          </div>
          <div className="info-row">
            <span>
              PIN Updated
            </span>
            <strong>
              {user?.pinUpdatedAt
                ? new Date(
                    user.pinUpdatedAt
                  ).toLocaleDateString()
                : "Not yet"}
            </strong>
          </div>
          <div className="info-row">
            <span>
              Two-Factor Authentication
            </span>
            <strong className="coming-soon">
              Coming Soon
            </strong>
          </div>
          <div className="info-row">
            <span>
              Logout From All Devices
            </span>
            <strong className="coming-soon">
              Coming Soon
            </strong>
          </div>
        </div>
      </section>
      <ActionModal isOpen={editing} title="Edit Profile" submitText="Save Changes" onClose={handleCancel} onSubmit={handleSave} loading={profileLoading} >
        <div className="profile-form">
          <input type="text" name="firstName" placeholder="First Name" value={ formData.firstName } onChange={handleChange} autoComplete="given-name" />
          <input type="text" name="lastName" placeholder="Last Name" value={ formData.lastName } onChange={handleChange} autoComplete="family-name" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete="email" />
        </div>
      </ActionModal>
      <ActionModal isOpen={ showPasswordModal} title="Change Password" submitText="Update Password" loading={passwordLoading} onClose={ closePasswordModal } onSubmit={ handleChangePassword } >
        <div className="profile-form">
          <input type="password" name="currentPassword" placeholder="Current Password" value={ passwordData.currentPassword } onChange={ handlePasswordChange } autoComplete="current-password" />
          <input type="password" name="newPassword" placeholder="New Password" value={ passwordData.newPassword } onChange={ handlePasswordChange } autoComplete="new-password" />
          <small className="form-help">
            Use at least 12
            characters.
          </small>
          <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={ passwordData.confirmPassword } onChange={ handlePasswordChange } autoComplete="new-password"/>
        </div>
      </ActionModal>
      <ActionModal isOpen={showPinModal} title="Change PIN" submitText="Update PIN" loading={pinLoading} onClose={closePinModal} onSubmit={handleChangePin } >
        <div className="profile-form">
          <input type="password" name="currentPin" placeholder="Current PIN" value={pinData.currentPin } onChange={handlePinChange } inputMode="numeric" maxLength={4} autoComplete="off"/>
          <input type="password" name="newPin" placeholder="New PIN" value={ pinData.newPin } onChange={ handlePinChange } inputMode="numeric" maxLength={4} autoComplete="off" />
          <input type="password" name="confirmPin" placeholder="Confirm PIN" value={pinData.confirmPin } onChange={handlePinChange } inputMode="numeric" maxLength={4} autoComplete="off" />
        </div>
      </ActionModal>
    </DashboardLayout>
  );
}
export default Profile;