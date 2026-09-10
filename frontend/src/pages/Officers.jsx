import { mapMember, publicApi, usePublicFeed } from '../api/public.js';
import { FeedError, FeedSkeleton, friendlyFeedError, hideImage } from '../components/FeedStates.jsx';

const legacyOfficers = [
  { name: 'Tyrone Tabornal', role: 'Campus Organizer', department: 'Executive Board', sy: 'S.Y. 2025-2026', image: '/legacy-images/Campus Organizer.jpg' },
  { name: 'James Niño Tan', role: 'Campus Organizer', department: 'Executive Board', sy: 'S.Y. 2025-2026', image: '/legacy-images/Chief-Technology-Officer.jpg' },
  { name: 'Michael Angelo Bejona', role: 'Chief Operating Officer', department: 'Executive Board', sy: 'S.Y. 2025-2026', image: '/legacy-images/Chief Operating Officer - Copy.jpg' },
  { name: 'Alexis Red Saranza', role: 'Chief Community Development Officer', department: 'Executive Board', sy: 'S.Y. 2025-2026', image: '/legacy-images/Chief community development Officer.jpg' },
  { name: 'Mikaela Vianca Molina', role: 'Chief Community Development Officer', department: 'Executive Board', sy: 'S.Y. 2025-2026', image: '/legacy-images/Consultant - Copy.jpg' },
  { name: 'Lucy Jean Bansag', role: 'Volunteer Management Lead', department: 'Operations', sy: 'S.Y. 2025-2026', image: '/legacy-images/Volunteer Management Lead - Copy.jpg' },
  { name: 'Ma. Cristine Bierba', role: 'Event Lead', department: 'Operations', sy: 'S.Y. 2025-2026', image: '/legacy-images/Event Lead.jpg' },
];

function OfficerCard({ name, role, meta, image, alt }) {
  return (
    <div className="gdg-card">
      {image ? (
        <img className="gdg-photo" src={image} alt={alt ?? name} loading="lazy" onError={hideImage} />
      ) : (
        <div className="gdg-photo-fallback">{name.charAt(0)}</div>
      )}
      <p className="gdg-role">{role}</p>
      <h3>{name}</h3>
      {meta ? <div className="gdg-card-meta"><span>{meta}</span></div> : null}
    </div>
  );
}

function groupByDepartment(members) {
  const groups = new Map();
  for (const m of members) {
    const key = m.department || 'Team';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  return [...groups.entries()].sort((a, b) => {
    if (a[0] === 'Executive Board') return -1;
    if (b[0] === 'Executive Board') return 1;
    return a[0].localeCompare(b[0]);
  });
}

export default function Officers() {
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getTeam().then((rows) => rows.map(mapMember).sort((a, b) => a.order - b.order)),
    'team-all',
  );

  const showFallback = !loading && !!error;

  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Leadership Team</span>
        <h2>
          Our <span className="gdg-gradient-text">Team</span>
        </h2>
        <p className="gdg-subtitle">
          The passionate leaders behind GDGoC CTU, dedicated to empowering
          developers and building an innovative community together.
        </p>
        <p className="gdg-motto">
          Build <span>•</span> Connect <span>•</span> Impact
        </p>
      </section>

      {loading ? (
        <section className="gdg-section" aria-label="Loading team">
          <FeedSkeleton count={6} label="Loading team…" />
        </section>
      ) : null}

      {!loading && error ? (
        <FeedError message={`${friendlyFeedError(error)} Showing last known roster.`} onRetry={retry} />
      ) : null}

      {!loading && !error && (!data || data.length === 0) ? (
        <p className="gdg-subtitle">No active team members published yet — check back soon.</p>
      ) : null}

      {!loading && !showFallback && data?.length
        ? groupByDepartment(data).map(([dept, members]) => (
          <section key={dept} className="gdg-section">
            <h2>{dept}</h2>
            <div className="gdg-grid">
              {members.map((m) => (
                <OfficerCard
                  key={m.id}
                  name={m.name}
                  role={m.role}
                  meta={[m.program, m.yearSection].filter(Boolean).join(' · ')}
                  image={m.photoUrl}
                  alt={m.photoAlt}
                />
              ))}
            </div>
          </section>
        ))
        : null}

      {showFallback ? (
        <>
          <section className="gdg-section">
            <h2>Executive Board</h2>
            <div className="gdg-grid">
              {legacyOfficers.filter((o) => o.department === 'Executive Board').map((officer) => (
                <OfficerCard key={officer.name} name={officer.name} role={officer.role} meta={officer.sy} image={officer.image} />
              ))}
            </div>
          </section>
          <section className="gdg-section">
            <h2>Operations Department</h2>
            <div className="gdg-grid">
              {legacyOfficers.filter((o) => o.department === 'Operations').map((officer) => (
                <OfficerCard key={officer.name} name={officer.name} role={officer.role} meta={officer.sy} image={officer.image} />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
