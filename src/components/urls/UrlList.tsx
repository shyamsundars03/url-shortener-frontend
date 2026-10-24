import type { Url } from '../../types/url.types';
import { UrlItem } from './UrlItem';

interface UrlListProps {
  urls: Url[];
  loading: boolean;
}

export function UrlList({ urls, loading }: UrlListProps) {
  if (loading && urls.length === 0) {
    return <p className="page-lead">Loading…</p>;
  }

  if (!loading && urls.length === 0) {
    return <p className="page-lead">No links yet — create one above.</p>;
  }

  return (
    <ul className="link-list">
      {urls.map((item) => (
        <UrlItem key={item.id} url={item} />
      ))}
    </ul>
  );
}
