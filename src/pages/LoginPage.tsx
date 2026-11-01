import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../constants/app-routes';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="page-card">
      <h1 className="page-title">Login</h1>
      <p className="page-lead">Sign in to create and manage your short links.</p>
      <LoginForm onLoggedIn={() => void navigate(APP_ROUTES.HOME)} />
      <p className="page-footer-text">
        New here? <Link to={APP_ROUTES.REGISTER}>Create an account</Link>
      </p>
    </div>
  );
}
