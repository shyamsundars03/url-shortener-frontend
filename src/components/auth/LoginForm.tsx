import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/axios-error.util';
import { validateEmail, validatePassword } from '../../utils/validation.util';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useToast } from '../../contexts/ToastContext';

interface LoginFormProps {
  onLoggedIn: () => void;
}

export function LoginForm({ onLoggedIn }: LoginFormProps) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateField() {
    let isValid = true;

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      isValid = false;
    } else {
      setEmailError(null);
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!validateField()) {
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      showToast('Successfully logged in!', 'success', 10000);
      onLoggedIn();
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {serverError && <p className="form-message form-message--error">{serverError}</p>}
      <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            onBlur={() => {
              const error = validateEmail(email);
              setEmailError(error);
            }}
            autoComplete="email"
          />
          {emailError && <span className="field-error">{emailError}</span>}
        </label>
        <label className="field">
          <span>Password</span>
          <div className="field-with-icon">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              onBlur={() => {
                const error = validatePassword(password);
                setPasswordError(error);
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a11.64 11.64 0 0 1 5.94-5.94M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {passwordError && <span className="field-error">{passwordError}</span>}
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <GoogleSignInButton />
    </>
  );
}
