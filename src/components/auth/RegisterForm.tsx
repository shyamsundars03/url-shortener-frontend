import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/axios-error.util';
import { validateName, validateEmail, validatePassword } from '../../utils/validation.util';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useToast } from '../../contexts/ToastContext';

interface RegisterFormProps {
  onRegistered: () => void;
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateField() {
    let isValid = true;

    const nameValidation = validateName(name);
    if (nameValidation) {
      setNameError(nameValidation);
      isValid = false;
    } else {
      setNameError(null);
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    } else if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else {
      setConfirmPasswordError(null);
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
      await register({ name: name.trim(), email: email.trim(), password });
      showToast('Successfully registered!', 'success', 10000);
      onRegistered();
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {serverError && <p className="form-message form-message--error">{serverError}</p>}
      <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            onBlur={() => {
              const error = validateName(name);
              setNameError(error);
            }}
            autoComplete="name"
          />
          {nameError && <span className="field-error">{nameError}</span>}
        </label>
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
        <label className="field">
          <span>Confirm password</span>
          <div className="field-with-icon">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(null);
              }}
              onBlur={() => {
                if (password !== confirmPassword) {
                  setConfirmPasswordError('Passwords do not match.');
                } else if (confirmPassword.trim() === '') {
                  setConfirmPasswordError('Please confirm your password.');
                } else {
                  setConfirmPasswordError(null);
                }
              }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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
          {confirmPasswordError && <span className="field-error">{confirmPasswordError}</span>}
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <GoogleSignInButton />
    </>
  );
}
