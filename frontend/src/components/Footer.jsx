import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-text-on-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">QuizGen</h3>
            <p className="text-sm text-granny-apple">
              Create, share, and take engaging quizzes on any topic.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="text-granny-apple hover:text-text-on-dark transition">
                  Home
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link to="/login" className="text-granny-apple hover:text-text-on-dark transition">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-granny-apple hover:text-text-on-dark transition">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="text-granny-apple hover:text-text-on-dark transition">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-granny-apple hover:text-text-on-dark transition">
                  Quiz History
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-granny-apple hover:text-text-on-dark transition">
                Twitter
              </a>
              <a href="#" className="text-granny-apple hover:text-text-on-dark transition">
                GitHub
              </a>
              <a href="#" className="text-granny-apple hover:text-text-on-dark transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-accent pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-granny-apple">
            <p>&copy; {currentYear} QuizGen. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-text-on-dark transition">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-text-on-dark transition">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-text-on-dark transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
