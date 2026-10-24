import { FormEvent, useState } from 'react';
import type { CreateUrlRequest, CreateUrlResponse } from '../../types/url.types';
import { validateOriginalUrl } from '../../utils/validation.util';
import { env } from '../../config/env';
import { useToast } from '../../contexts/ToastContext';

interface CreateUrlFormProps {
  onCreate: (payload: CreateUrlRequest) => Promise<CreateUrlResponse | null>;
  apiError?: string | null;
  onClearApiError?: () => void;
}

export function CreateUrlForm({ onCreate, apiError, onClearApiError }: CreateUrlFormProps) {
  const { showToast } = useToast();
  const [originalUrl, setOriginalUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Combine local validation error with API error — local takes priority
  const displayError = validationError ?? apiError ?? null;
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateOriginalUrl(originalUrl);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setIsProcessing(true);
    const created = await onCreate({ originalUrl: originalUrl.trim() });
    setIsProcessing(false);
    if (created) {
      setShortUrl(created.shortUrlFull ?? `${env.apiBaseUrl}/${created.shortUrl}`);
      setOriginalUrl('');
      showToast('Short link created successfully!', 'success', 10000);
    }
  }

  async function handleCopy() {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
  }

  function handleReset() {
    setShortUrl(null);
    setCopied(false);
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      {shortUrl ? (
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={shortUrl}
            readOnly
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              textAlign: 'center',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleCopy()}
            style={{ width: '100%' }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Shorten Another
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
          <label className="field">
            <span>Paste your long URL</span>
            <input
              type="text"
              placeholder="https://example.com/very-long-url"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value);
                setValidationError(null);
                onClearApiError?.();
              }}
              disabled={isProcessing}
              readOnly={isProcessing}
              style={{ padding: '1rem', fontSize: '1.1rem' }}
            />
          </label>
          {displayError ? <p className="form-message form-message--error">{displayError}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ width: '100%' }}>
            {isProcessing ? 'Loading...' : 'Process'}
          </button>
        </form>
      )}
    </div>
  );
}
