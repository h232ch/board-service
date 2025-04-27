import React from 'react';
import { User } from '../../types/User';
import './Profile.css';

interface ProfileProps {
  user: User;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <div className="profile-header">
          <h2>My Profile</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar">
            {user.id.charAt(0).toUpperCase()}
          </div>
          
          <div className="profile-info">
            <div className="info-group">
              <label>Username</label>
              <span>{user.id}</span>
            </div>
            
            <div className="info-group">
              <label>Member Since</label>
              <span>{formatDate(user.signupDate)}</span>
            </div>
            
            <div className="info-group">
              <label>Last Login</label>
              <span>{formatDate(user.loginDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 