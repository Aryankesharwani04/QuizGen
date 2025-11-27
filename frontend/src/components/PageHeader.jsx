import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function PageHeader() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-bg-light shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold text-primary">
            QuizGen
          </Link>

          {/* Navigation */}
          {!loading && (
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent-light transition"
                  >
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium text-text-primary">
                      {user?.full_name || user?.data?.full_name || 'User'}
                    </span>
                    <svg
                      className={`w-4 h-4 transition ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-bg-light rounded-lg shadow-lg z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-text-primary hover:bg-accent-light rounded-t-lg"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/avatar"
                        className="block px-4 py-2 text-text-primary hover:bg-accent-light"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Change Avatar
                      </Link>
                      <Link
                        to="/history"
                        className="block px-4 py-2 text-text-primary hover:bg-accent-light"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        History
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-ocean-green hover:bg-accent-light rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-primary hover:bg-accent-light transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-primary text-text-on-dark hover:bg-primary-dark transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
