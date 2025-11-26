import { useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import { requestPasswordReset } from '../api/authService';

export default function PasswordResetRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await requestPasswordReset({
        email: formData.email,
      });

      if (response.success) {
        setSuccess('Password reset link has been sent to your email!');
        return { success: true };
      } else {
        setError(response.message || 'Failed to send reset link');
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
            Reset Password
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password
          </p>

          <SimpleForm
            fields={[
              {
                name: 'email',
                type: 'email',
                label: 'Email',
                placeholder: 'your@email.com',
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
            buttonText="Send Reset Link"
          />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
