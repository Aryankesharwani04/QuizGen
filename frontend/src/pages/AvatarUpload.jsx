import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAvatar } from '../api/authService';
import { useAuth } from '../hooks/useAuth';

export default function AvatarUpload() {
  const navigate = useNavigate();
  const { refreshProfile, user } = useAuth();
  const userAvatar = user?.data?.avatar || user?.avatar;
  const [preview, setPreview] = useState(userAvatar || null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateAvatar(file);

      if (response.success) {
        setSuccess('Avatar uploaded successfully!');
        setFile(null);
        await refreshProfile();
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Change Avatar</h1>

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

      <div className="bg-white rounded-lg shadow p-8">
        {/* Preview */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
          <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl text-gray-400">👤</span>
            )}
          </div>
        </div>

        {/* File Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:bg-primary-600 file:text-white file:cursor-pointer file:border-0"
          />
          <p className="text-xs text-gray-500 mt-2">Supported: JPG, PNG, GIF (max 5MB)</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
