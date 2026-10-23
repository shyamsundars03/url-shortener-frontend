import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setApiStatus('online')
        else setApiStatus('offline')
      })
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <div className="app-container">
      <div className="hero">
        <div className="logo-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <h1 className="hero-title">URL Shortener</h1>
        <p className="hero-subtitle">Shorten, manage, and track your URLs with ease</p>

        <div className="status-cards">
          <div className="status-card">
            <div className="status-dot online"></div>
            <div className="status-info">
              <span className="status-label">Frontend</span>
              <span className="status-value">Running on port 3000</span>
            </div>
          </div>
          <div className="status-card">
            <div className={`status-dot ${apiStatus === 'checking' ? 'checking' : apiStatus === 'online' ? 'online' : 'offline'}`}></div>
            <div className="status-info">
              <span className="status-label">Backend API</span>
              <span className="status-value">
                {apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Running on port 3001' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <p>🚀 Full app coming soon — authentication, URL creation & dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default App
