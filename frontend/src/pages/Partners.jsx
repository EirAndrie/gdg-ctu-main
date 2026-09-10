import { TIER_ORDER, publicApi, sortPartners, usePublicFeed } from '../api/public.js';
import { FeedError, FeedSkeleton, friendlyFeedError } from '../components/FeedStates.jsx';

function hideImage(e) {
  e.currentTarget.style.display = 'none';
}

const TIER_LABELS = {
  platinum: 'Platinum Partners',
  gold: 'Gold Partners',
  silver: 'Silver Partners',
  community: 'Community Partners',
};

export default function Partners() {
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getPartners().then(sortPartners),
    'partners-all',
  );

  const groups = (data ?? []).reduce((acc, p) => {
    const tier = TIER_ORDER[p.tier] !== undefined ? p.tier : 'community';
    (acc[tier] ??= []).push(p);
    return acc;
  }, {});
  const orderedTiers = Object.keys(groups).sort((a, b) => (TIER_ORDER[a] ?? 9) - (TIER_ORDER[b] ?? 9));

  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Our Partners</span>
        <h2>
          Trusted <span className="gdg-gradient-text">Partners</span>
        </h2>
        <p className="gdg-subtitle">
          We proudly collaborate with leading technology companies, academic
          institutions, and developer communities.
        </p>
      </section>

      {loading ? <FeedSkeleton count={4} label="Loading partners…" /> : null}
      {!loading && error ? <FeedError message={friendlyFeedError(error)} onRetry={retry} /> : null}
      {!loading && !error && (!data || data.length === 0) ? (
        <p className="gdg-subtitle">No partners published yet — check back soon.</p>
      ) : null}

      {!loading && !error && data?.length
        ? orderedTiers.map((tier) => (
          <section key={tier} className="gdg-section" aria-label={TIER_LABELS[tier] ?? tier}>
            <h2>{TIER_LABELS[tier] ?? tier}</h2>
            <div className="gdg-grid">
              {groups[tier].map((partner) => (
                <div key={partner.id} className="gdg-card">
                  {partner.logoUrl ? (
                    <img className="gdg-photo" src={partner.logoUrl} alt={partner.logoAlt} loading="lazy" onError={hideImage} />
                  ) : (
                    <div className="gdg-photo-fallback">{partner.name.charAt(0)}</div>
                  )}
                  <p><span className="gdg-tag">{partner.tier}</span></p>
                  <h3>{partner.name}</h3>
                  {partner.description ? <p>{partner.description}</p> : null}
                  {partner.website ? (
                    <div className="gdg-btn-row">
                      <a href={partner.website} target="_blank" rel="noreferrer" className="gdg-btn gdg-btn-secondary">
                        Visit site
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))
        : null}
    </div>
  );
}
