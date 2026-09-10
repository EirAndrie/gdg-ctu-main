import { Link } from 'react-router-dom';

/** Shared <img onError> fallback — hides broken legacy/CMS images. Import this instead of redefining it per page. */
export function hideImage(e) {
  e.currentTarget.style.display = 'none';
}

/** Loading skeletons for CMS-fed public strips (layout preserved while fetching). */
export function FeedSkeleton({ count = 3, label = 'Loading…' }) {
  return (
    <div className="gdg-grid" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="gdg-card" aria-hidden="true">
          <div className="gdg-skeleton gdg-skeleton-photo" />
          <div className="gdg-skeleton gdg-skeleton-line" />
          <div className="gdg-skeleton gdg-skeleton-line short" />
        </div>
      ))}
      <span className="gdg-visually-hidden">{label}</span>
    </div>
  );
}

/** Error banner with retry. Callers decide whether to also render legacy fallback. */
export function FeedError({ message = 'Could not load this section.', onRetry }) {
  return (
    <div className="gdg-feed-error" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="gdg-btn gdg-btn-secondary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function friendlyFeedError(error) {
  if (!error) return 'Could not load this section.';
  if (error.status === 404) return 'This content is not published yet.';
  if (error.status >= 500) return 'The content service is temporarily unavailable. Please retry.';
  return error?.body?.message ?? error?.message ?? 'Could not load this section.';
}

/** Strip heading with a link to the full page. */
export function StripHead({ badge, title, to, linkLabel = 'View all' }) {
  return (
    <div className="gdg-strip-head">
      <div>
        {badge ? <span className="gdg-badge">{badge}</span> : null}
        <h2>{title}</h2>
      </div>
      {to ? <Link to={to} className="gdg-btn gdg-btn-secondary">{linkLabel}</Link> : null}
    </div>
  );
}
