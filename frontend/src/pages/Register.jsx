import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SimpleForm from '../components/SimpleForm';
import { registerUser } from '../api/authService';

export default function Register() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 text-center mb-8">
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

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
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
