import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, sendVerificationEmail } from '../api/authService';

export default function Profile() {
  const { user, loading, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      // Handle if user is the full response object or just the data
      const userData = user.data || user;
      setFormData({
        full_name: userData.full_name || '',
      });
      console.log('User data loaded:', userData);
      console.log('Full name value:', userData.full_name);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      full_name: user?.full_name || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile({
        full_name: formData.full_name,
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        await refreshProfile();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setVerifyLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await sendVerificationEmail();

      if (response.success) {
        setSuccess('Verification email sent! Check your inbox.');
      } else {
        setError(response.message || 'Failed to send verification email');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Avatar</h2>
        <div className="flex items-center gap-6">
          {(user?.data?.avatar || user?.data?.avatar_file || user?.avatar || user?.avatar_file) ? (
            <img
              src={user?.data?.avatar || user?.data?.avatar_file || user?.avatar || user?.avatar_file}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-400">👤</span>
            </div>
          )}
          <a
            href="/avatar"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Change Avatar
          </a>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={updateLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={updateLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={updateLoading}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium text-gray-900">
                {(user?.data?.full_name || user?.full_name) || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-medium text-gray-900">
                  {user?.data?.email || user?.email}
                </p>
                {(user?.data?.email_verified || user?.email_verified) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                    Unverified
                  </span>
                )}
              </div>
            </div>
            {!(user?.data?.email_verified || user?.email_verified) && (
              <div className="pt-4">
                <button
                  onClick={handleSendVerification}
                  disabled={verifyLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition"
                >
                  {verifyLoading ? 'Sending...' : 'Send Verification Email'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
