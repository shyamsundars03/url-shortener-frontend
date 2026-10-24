import { useState } from 'react';
import type { Url } from '../../types/url.types';
import { env } from '../../config/env';

interface UrlItemProps {
  url: Url;
}

export function UrlItem({ url }: UrlItemProps) {
  const [copied, setCopied] = useState(false);
  const shortFull = url.shortUrlFull ?? `${env.apiBaseUrl}/${url.shortUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortFull);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className="link-list-item">
      <div>
        <strong>{shortFull}</strong>
        <p>{url.originalUrl}</p>
      </div>
      <div className="link-item-actions">
        <span className="link-meta">{url.lastVisited.length} visits</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => void handleCopy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </li>
  );
}
