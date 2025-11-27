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
    <div className="max-w-2xl mx-auto p-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Change Avatar</h1>

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

      <div className="bg-bg-light rounded-lg shadow p-8">
        {/* Preview */}
        <div className="mb-8">
          <p className="text-sm font-medium text-text-primary mb-4">Preview</p>
          <div className="w-48 h-48 rounded-lg bg-accent-light flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl text-primary-dark">👤</span>
            )}
          </div>
        </div>

        {/* File Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-primary mb-4">
            Select Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-dashed border-accent rounded-lg text-primary-dark file:mr-3 file:px-4 file:py-2 file:rounded-lg file:bg-primary file:text-text-on-dark file:cursor-pointer file:border-0"
          />
          <p className="text-xs text-primary-dark mt-2">Supported: JPG, PNG, GIF (max 5MB)</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark disabled:bg-accent-light transition font-medium"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-2 bg-accent-light text-text-primary rounded-lg hover:bg-accent transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
