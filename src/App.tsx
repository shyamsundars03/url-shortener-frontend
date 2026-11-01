import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { ToastProvider } from './contexts/ToastContext';
import { APP_ROUTES } from './constants/app-routes';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.AUTH_CALLBACK} element={<OAuthCallbackPage />} />
          <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
