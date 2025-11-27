import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AvatarUpload from './pages/AvatarUpload';
import History from './pages/History';
import VerifyEmail from './pages/VerifyEmail';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetConfirm from './pages/PasswordResetConfirm';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes without Header/Footer */}
      <Route path="/login" element={<Layout hideHeaderFooter={true}><Login /></Layout>} />
      <Route path="/register" element={<Layout hideHeaderFooter={true}><Register /></Layout>} />
      <Route path="/verify-email" element={<Layout hideHeaderFooter={true}><VerifyEmail /></Layout>} />
      <Route path="/password-reset" element={<Layout hideHeaderFooter={true}><PasswordResetRequest /></Layout>} />
      <Route path="/reset-password" element={<Layout hideHeaderFooter={true}><PasswordResetConfirm /></Layout>} />

      {/* Public Routes with Header/Footer */}
      <Route path="/home" element={<Layout><Home /></Layout>} />

      {/* Protected Routes with Header/Footer */}
      <Route
        path="/profile"
        element={
          <Layout>
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          </Layout>
        }
      />
      <Route
        path="/avatar"
        element={
          <Layout>
            <PrivateRoute>
              <AvatarUpload />
            </PrivateRoute>
          </Layout>
        }
      />
      <Route
        path="/history"
        element={
          <Layout>
            <PrivateRoute>
              <History />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Fallback - redirect root to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
