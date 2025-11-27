import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/authService';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(token);

        if (response.success) {
          // Check if email was already verified
          if (response.message && response.message.toLowerCase().includes('already verified')) {
            setAlreadyVerified(true);
            setSuccess(true);
          } else {
            setSuccess(true);
          }
          setError(null);

          // Auto-redirect after 2 seconds
          setRedirecting(true);
          setTimeout(() => {
            // If user is already logged in, redirect to home, otherwise to login
            if (user) {
              navigate('/home');
            } else {
              navigate('/login');
            }
          }, 2000);
        } else {
          setError(response.message || 'Verification failed');
          setSuccess(false);
          setAlreadyVerified(false);
        }
      } catch (err) {
        setError('An error occurred during verification');
        setSuccess(false);
        setAlreadyVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-granny-apple flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-bg-light rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary-dark">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-granny-apple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-light rounded-lg shadow-lg p-8">
          {success ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-light">
                  <span className="text-3xl text-primary">✓</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {alreadyVerified ? 'Email Already Verified' : 'Email Verified!'}
              </h1>
              <p className="text-primary-dark mb-4">
                {alreadyVerified
                  ? 'Your email has already been verified. You can proceed to login.'
                  : 'Your email has been successfully verified. You can now use all features.'}
              </p>
              {redirecting && (
                <p className="text-sm text-primary-dark mb-6">
                  Redirecting you to {user ? 'home' : 'login'} in 2 seconds...
                </p>
              )}
              <Link
                to={user ? "/home" : "/login"}
                className="inline-block px-6 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark transition font-medium"
              >
                Go to {user ? 'Home' : 'Login'}
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ocean-green">
                  <span className="text-3xl text-bg-dark">✕</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Verification Failed
              </h1>
              <p className="text-primary-dark mb-2">{error || 'Could not verify your email'}</p>
              <p className="text-sm text-primary-dark mb-6">
                Please try again or request a new verification email.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-primary text-text-on-dark rounded-lg hover:bg-primary-dark transition font-medium"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
