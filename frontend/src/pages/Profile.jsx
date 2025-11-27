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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-dark">Loading profile...</p>
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
    <div className="max-w-4xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-8">My Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-ocean-green border border-accent rounded-lg">
          <p className="text-sm text-bg-dark">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-accent-light border border-accent rounded-lg">
          <p className="text-sm text-text-primary">{success}</p>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-bg-light rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Avatar</h2>
        <div className="flex items-center gap-6">
          {(user?.data?.avatar || user?.data?.avatar_file || user?.avatar || user?.avatar_file) ? (
            <img
              src={user?.data?.avatar || user?.data?.avatar_file || user?.avatar || user?.avatar_file}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-accent-light flex items-center justify-center">
              <span className="text-4xl text-primary-dark">👤</span>
            </div>
          )}
          <a
            href="/avatar"
            className="px-6 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark transition"
          >
            Change Avatar
          </a>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="bg-bg-light rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark transition"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={updateLoading}
                className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-accent-light"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={updateLoading}
                className="px-6 py-2 bg-accent text-text-primary rounded-lg hover:bg-accent-dark disabled:bg-accent-light transition"
              >
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={updateLoading}
                className="px-6 py-2 bg-accent-light text-text-primary rounded-lg hover:bg-accent disabled:bg-accent-light transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-primary-dark">Full Name</p>
              <p className="text-lg font-medium text-text-primary">
                {(user?.data?.full_name || user?.full_name) || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-primary-dark">Email</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-medium text-text-primary">
                  {user?.data?.email || user?.email}
                </p>
                {(user?.data?.email_verified || user?.email_verified) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-light text-text-primary">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ocean-green text-bg-dark">
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
                  className="px-6 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark disabled:bg-accent-light transition"
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
