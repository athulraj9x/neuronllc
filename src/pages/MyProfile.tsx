import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { UserProfileForm } from '../../packages/user-profile-form/src/UserProfileForm';
import { UserFormData } from '../types';
import './MyProfile.css';

export const MyProfile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { updateUser } = useUsers();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (userData: UserFormData) => {
    updateUser(currentUser.id, userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getInitialData = (): UserFormData => ({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone,
    addresses: currentUser.addresses
  });

  return (
    <div className="my-profile-page">
      <div className="my-profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and addresses</p>
      </div>

      <div className="my-profile-content">
        <div className="profile-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-profile-btn"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <UserProfileForm
          mode={isEditing ? 'edit' : 'view'}
          initialData={getInitialData()}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
