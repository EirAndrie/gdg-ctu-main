const officers = [
  {
    name: 'Tyrone Tabornal',
    role: 'Campus Organizer',
    department: 'Executive Board',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Campus Organizer.jpg',
  },
  {
    name: 'James Niño Tan',
    role: 'Campus Organizer',
    department: 'Executive Board',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Chief-Technology-Officer.jpg',
  },
  {
    name: 'Michael Angelo Bejona',
    role: 'Chief Operating Officer',
    department: 'Executive Board',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Chief Operating Officer - Copy.jpg',
  },
  {
    name: 'Alexis Red Saranza',
    role: 'Chief Community Development Officer',
    department: 'Executive Board',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Chief community development Officer.jpg',
  },
  {
    name: 'Mikaela Vianca Molina',
    role: 'Chief Community Development Officer',
    department: 'Executive Board',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Consultant - Copy.jpg',
  },
  {
    name: 'Lucy Jean Bansag',
    role: 'Volunteer Management Lead',
    department: 'Operations',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Volunteer Management Lead - Copy.jpg',
  },
  {
    name: 'Ma. Cristine Bierba',
    role: 'Event Lead',
    department: 'Operations',
    sy: 'S.Y. 2025-2026',
    image: '/legacy-images/Event Lead.jpg',
  },
];

function OfficerCard({ officer }) {
  return (
    <div className="gdg-card">
      {officer.image ? (
        <img
          className="gdg-photo"
          src={officer.image}
          alt={officer.name}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="gdg-photo-fallback">{officer.name.charAt(0)}</div>
      )}
      <p className="gdg-role">{officer.role}</p>
      <h3>{officer.name}</h3>
      <div className="gdg-card-meta">
        <span>{officer.department}</span>
        <span>{officer.sy}</span>
      </div>
    </div>
  );
}

export default function Officers() {
  const executives = officers.filter(
    (officer) => officer.department === 'Executive Board',
  );
  const operations = officers.filter(
    (officer) => officer.department === 'Operations',
  );

  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Leadership Team</span>
        <h2>
          Our <span className="gdg-gradient-text">Officers</span>
        </h2>
        <p className="gdg-subtitle">
          The passionate leaders behind GDGoC CTU, dedicated to empowering
          developers and building an innovative community together.
        </p>
        <p className="gdg-motto">
          Build <span>•</span> Connect <span>•</span> Impact
        </p>
      </section>

      <section className="gdg-section">
        <h2>Executive Board</h2>
        <div className="gdg-grid">
          {executives.map((officer) => (
            <OfficerCard key={officer.name} officer={officer} />
          ))}
        </div>
      </section>

      <section className="gdg-section">
        <h2>Operations Department</h2>
        <div className="gdg-grid">
          {operations.map((officer) => (
            <OfficerCard key={officer.name} officer={officer} />
          ))}
        </div>
      </section>
    </div>
  );
}
