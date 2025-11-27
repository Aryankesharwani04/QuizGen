import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { loginUser, googleSignIn } from '../api/authService';
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
        navigate('/home');
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

  const handleGoogleSuccess = (userData) => {
    console.log('Google sign-in successful:', userData);
    // User is already authenticated via the GoogleSignInButton component
    navigate('/home');
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-granny-apple flex flex-col items-center justify-center p-4">
      {/* Logo at Top */}
      <Link to="/home" className="mb-8">
        <div className="text-4xl font-bold text-primary">
          QuizGen
        </div>
      </Link>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-bg-light rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-primary-dark text-center mb-8">
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

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 border-t-2 border-primary-light"></div>
            <span className="text-primary-dark text-sm">or</span>
            <div className="flex-1 border-t-2 border-primary-light"></div>
          </div>

          {/* Google Sign-In */}
          <div className="mt-6">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          {/* Footer Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-primary-dark">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                Register here
              </Link>
            </p>
            <p className="text-primary-dark">
              <Link to="/password-reset" className="text-primary hover:text-primary-dark font-medium">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
