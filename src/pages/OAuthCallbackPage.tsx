import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { completeOAuthLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');

    if (token && refresh) {
      try {
        completeOAuthLogin(token, refresh);
        void navigate('/', { replace: true });
      } catch {
        void navigate('/login?error=oauth_failed', { replace: true });
      }
    } else {
      void navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, completeOAuthLogin, navigate]);

  return (
    <div className="home-container">
      <div className="page-card" style={{ textAlign: 'center' }}>
        <p className="page-lead">Signing you in…</p>
      </div>
    </div>
  );
}
