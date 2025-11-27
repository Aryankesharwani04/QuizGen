import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ children }) {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const loading = authContext?.loading ?? true;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granny-apple">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
