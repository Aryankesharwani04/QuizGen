import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { registerUser, googleSignIn } from '../api/authService';
import { useAuth } from '../hooks/useAuth';
import { extractGoogleUserData } from '../utils/googleAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const response = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password,
      });

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return { success: true };
      } else {
        setError(response.message || 'Registration failed');
        setFieldErrors(response.errors || {});
        return { errors: response.errors || {} };
      }
    } catch (err) {
      setError('An error occurred during registration');
      return { errors: {} };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    setError(null);

    try {
      const userData = extractGoogleUserData(credential);
      const response = await googleSignIn(credential);

      if (response.success) {
        // Update context with user data
        login(userData);
        await refreshProfile();
        navigate('/home');
      } else {
        setError(response.message || 'Google Sign-In failed');
      }
    } catch (err) {
      setError('An error occurred during Google Sign-In');
      console.error('Google Sign-In error:', err);
    } finally {
      setLoading(false);
    }
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
            Create Account
          </h1>
          <p className="text-primary-dark text-center mb-8">
            Join us today and start taking quizzes
          </p>

          {/* Form */}
          <SimpleForm
            fields={[
              {
                name: 'full_name',
                type: 'text',
                label: 'Full Name',
                placeholder: 'John Doe',
                required: true,
              },
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
                placeholder: 'At least 8 characters',
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
            buttonText="Create Account"
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
          <div className="mt-6 text-center text-sm">
            <p className="text-primary-dark">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
