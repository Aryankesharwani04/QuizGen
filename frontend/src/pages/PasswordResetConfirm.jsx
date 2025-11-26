import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import { confirmPasswordReset } from '../api/authService';

export default function PasswordResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or expired. Please request a new one.
            </p>
            <Link
              to="/password-reset"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await confirmPasswordReset({
        token,
        new_password: formData.password,
      });

      if (response.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return { success: true };
      } else {
        setError(response.message || 'Failed to reset password');
        return { errors: response.errors || {} };
      }
    } catch (err) {
      setError('An error occurred');
      return { errors: {} };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Set New Password
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your new password below
          </p>

          <SimpleForm
            fields={[
              {
                name: 'password',
                type: 'password',
                label: 'New Password',
                placeholder: 'At least 8 characters',
                required: true,
              },
              {
                name: 'confirmPassword',
                type: 'password',
                label: 'Confirm Password',
                placeholder: 'Confirm your password',
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
            buttonText="Reset Password"
          />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
