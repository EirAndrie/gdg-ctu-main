const albums = [
  {
    title: 'HackIT The IBPAP Challenge',
    category: 'Hackathon',
    date: 'August 17, 2026',
    venue: 'Cebu Institute of Technology – University',
    description:
      'Students from Cebu Technological University - Main Campus, most of them serving as officers of GDGoC-CTU.',
    cover: '/legacy-images/gallery/1.jpg',
    photoCount: 1,
  },
  {
    title: 'DevFest Cebu 2025',
    category: 'Event',
    date: 'November 30, 2025',
    venue: 'Golden Peak Hotel & Suites',
    description:
      'GDGoC CTU was proud to be a partner for DevFest Cebu 2025 with the amazing Cebu tech community.',
    cover: '/legacy-images/gallery/gdgdev4.jpg',
    photoCount: 5,
  },
  {
    title: 'GDGoC-CTU Jam 1',
    category: 'Event',
    date: 'November 10, 2025',
    venue: 'Online',
    description:
      'More than just a jam — a sign of huge progress for our developer community at CTU and the local game jam scene.',
    cover: '/legacy-images/gallery/JAM1.jpg',
    photoCount: 4,
  },
];

export default function Gallery() {
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Our Memories</span>
        <h2>
          Captured <span className="gdg-gradient-text">Moments</span>
        </h2>
        <p className="gdg-subtitle">
          Discover the memorable events, workshops, bootcamps, hackathons, and
          community activities that shaped GDG - Cebu Technological University
          - Main Campus.
        </p>
        <div className="gdg-grid">
          {albums.map((album) => (
            <div key={album.title} className="gdg-card">
              <img
                className="gdg-photo"
                src={album.cover}
                alt={album.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p>
                <span className="gdg-tag">{album.category}</span>
              </p>
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <div className="gdg-card-meta">
                <span>{album.date}</span>
                <span>{album.venue}</span>
                <span>{album.photoCount} Photos</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
