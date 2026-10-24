import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page-card hero">
      <h1 className="hero-title">404</h1>
      <p className="hero-subtitle">Page not found</p>
      <div className="page-actions">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
