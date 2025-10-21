import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, User, Mail, Phone, Calendar } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

const ProfileModal = ({ isOpen, onClose }) => {
  const { userProfile, user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xl">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userProfile?.full_name || 'Demo User'}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {userProfile?.role?.replace('_', ' ') || 'Patient'}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {userProfile?.email || user?.email || 'demo@example.com'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {userProfile?.phone_number || '+91 9876543210'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Member since {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileModal;
