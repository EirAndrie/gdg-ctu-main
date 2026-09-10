import { Link, useParams, useSearchParams } from 'react-router-dom';
import { formatDate, mapEvent, publicApi, usePublicFeed } from '../api/public.js';
import { FeedError, FeedSkeleton, friendlyFeedError } from '../components/FeedStates.jsx';

const SCOPES = ['upcoming', 'featured', 'past'];

function hideImage(e) {
  e.currentTarget.style.display = 'none';
}

function EventCard({ event }) {
  return (
    <Link
      to={event.slug ? `/events/${event.slug}` : '/events'}
      className="gdg-card gdg-card-link"
    >
      {event.coverUrl ? (
        <img className="gdg-photo" src={event.coverUrl} alt={event.coverAlt} loading="lazy" onError={hideImage} />
      ) : null}
      <p>
        {event.featured ? <span className="gdg-tag">Featured</span> : null}{' '}
        {event.status ? <span className="gdg-tag gdg-tag-green">{event.status}</span> : null}
      </p>
      <h3>{event.title}</h3>
      <p>{event.short || event.description}</p>
      <div className="gdg-card-meta">
        {event.startAt ? <span>{formatDate(event.startAt)}</span> : null}
        {event.endAt ? <span>– {formatDate(event.endAt)}</span> : null}
        {event.location ? <span>{event.location}</span> : null}
      </div>
    </Link>
  );
}

function EventDetail({ slug }) {
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getEventBySlug(slug).then((e) => (e ? mapEvent(e) : null)),
    `event-${slug}`,
  );
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <Link to="/events" className="gdg-btn gdg-btn-secondary">← All events</Link>
        {loading ? <FeedSkeleton count={1} label="Loading event…" /> : null}
        {!loading && (error || !data) ? (
          <FeedError message={error ? friendlyFeedError(error) : 'This event is not published.'} onRetry={retry} />
        ) : null}
        {!loading && !error && data ? (
          <>
            <span className="gdg-badge">Event</span>
            <h2>{data.title}</h2>
            {data.coverUrl ? (
              <img className="gdg-photo" src={data.coverUrl} alt={data.coverAlt} onError={hideImage} />
            ) : null}
            {data.short ? <p className="gdg-subtitle">{data.short}</p> : null}
            {data.description ? <p>{data.description}</p> : null}
            <div className="gdg-card-meta">
              {data.startAt ? <span>Starts: {formatDate(data.startAt)}</span> : null}
              {data.endAt ? <span>Ends: {formatDate(data.endAt)}</span> : null}
              {data.location ? <span>{data.location}</span> : null}
            </div>
            {data.registrationEnabled && data.registrationUrl ? (
              <div className="gdg-btn-row">
                <a href={data.registrationUrl} target="_blank" rel="noreferrer" className="gdg-btn gdg-btn-primary">
                  Register
                </a>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}

export default function Events() {
  const { slug } = useParams();
  if (slug) return <EventDetail slug={slug} />;
  return <EventsList />;
}

function EventsList() {
  const [params, setParams] = useSearchParams();

  const scope = SCOPES.includes(params.get('scope')) ? params.get('scope') : 'upcoming';
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getEvents(scope).then((rows) => rows.map(mapEvent)),
    `events-${scope}`,
  );

  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Our Events</span>
        <h2>
          Our <span className="gdg-gradient-text">Events</span>
        </h2>
        <p className="gdg-subtitle">
          Learn, connect, compete, and innovate through workshops, bootcamps,
          hackathons, community meetups, and exciting Google Developer Group
          activities.
        </p>
        <div className="gdg-tabs" role="tablist" aria-label="Event scopes">
          {SCOPES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={scope === s}
              className={scope === s ? 'is-active' : ''}
              onClick={() => setParams({ scope: s })}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {loading ? <FeedSkeleton label={`Loading ${scope} events…`} /> : null}
        {!loading && error ? (
          <FeedError message={friendlyFeedError(error)} onRetry={retry} />
        ) : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <p className="gdg-subtitle">No {scope} events right now — check back soon.</p>
        ) : null}
        {!loading && !error && data?.length ? (
          <div className="gdg-grid">
            {data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
