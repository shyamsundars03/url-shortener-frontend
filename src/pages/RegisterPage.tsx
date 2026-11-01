import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../constants/app-routes';

export function RegisterPage() {
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

  function handleRegistered() {
    void navigate(APP_ROUTES.LOGIN);
  }

  return (
    <div className="page-card">
      <h1 className="page-title">Register</h1>
      <p className="page-lead">Create an account with email and password.</p>
      <RegisterForm onRegistered={handleRegistered} />
      <p className="page-footer-text">
        Already have an account? <Link to={APP_ROUTES.LOGIN}>Sign in</Link>
      </p>
    </div>
  );
}
