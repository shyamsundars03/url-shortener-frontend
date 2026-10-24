import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUrls } from '../hooks/useUrls';
import { CreateUrlForm } from '../components/urls/CreateUrlForm';
import { UrlList } from '../components/urls/UrlList';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { urls, loading, error, success, fetchUrls, createUrl, total, page, limit, totalPages, setPage, setSearch, clearMessages } = useUrls();
  const pollIntervalRef = useRef<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchUrls();
      
      // Poll for URL updates every 10 seconds
      pollIntervalRef.current = setInterval(() => {
        void fetchUrls();
      }, 10000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isAuthenticated, page, limit, fetchUrls]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 1000);
  };

  async function handleLogout() {
    await logout();
    void navigate('/login');
  }

  if (authLoading) {
    return (
      <div className="home-container">
        <div className="page-card">
          <p className="page-lead">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <div className="page-card hero">
          <h1 className="hero-title">URL Shortener</h1>
          <p className="hero-subtitle">Shorten your URLs with ease</p>

          <div className="page-actions">
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>

          <GoogleSignInButton />
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="page-card">
        <div className="page-row">
          <div>
            <h1 className="page-title">URL Shortener</h1>
            <p className="page-lead">
              {user ? `Signed in as ${user.email}` : 'Manage your short links.'}
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => void handleLogout()}>
            Logout
          </button>
        </div>

        <CreateUrlForm onCreate={createUrl} apiError={error} onClearApiError={clearMessages} />

        {success ? <p className="form-message form-message--success">{success}</p> : null}
      </div>

      <div className="page-card page-card--wide">
        <section className="link-list-section">
          <div className="link-list-header">
            <h2 className="section-title">Your links ({total})</h2>
            <input
              type="text"
              placeholder="Search URLs..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
          <UrlList urls={urls} loading={loading} />
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
