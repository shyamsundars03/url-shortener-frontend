import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

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
      <LoginForm onLoggedIn={() => void navigate('/')} />
      <p className="page-footer-text">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
