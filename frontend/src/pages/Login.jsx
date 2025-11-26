import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import { loginUser, getProfile } from '../api/authService';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Fetch full profile and update context
        await refreshProfile();
        navigate('/profile');
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        setFieldErrors(response.errors || {});
        return { errors: response.errors || {} };
      }
    } catch (err) {
      setError('An error occurred during login');
      return { errors: {} };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to your account to continue
          </p>

          {/* Form */}
          <SimpleForm
            fields={[
              {
                name: 'email',
                type: 'email',
                label: 'Email',
                placeholder: 'your@email.com',
                required: true,
              },
              {
                name: 'password',
                type: 'password',
                label: 'Password',
                placeholder: 'Your password',
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            buttonText="Sign In"
          />

          {/* Footer Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
            <p className="text-gray-600">
              <Link to="/password-reset" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
