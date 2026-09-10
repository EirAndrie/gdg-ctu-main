const events = [
  {
    title: 'Automate Anything - Intro to AI Agents',
    category: 'Workshop',
    status: 'Finished',
    date: 'December 20, 2025',
    time: '10:00 PM - 11:25 PM',
    venue: 'Google Meet (Online)',
    description:
      "Join Lamatic.ai and GDGoC-CTU for a beginner-friendly deep dive: Intro to AI Agents. Whether you're a student, a product builder, or just curious about agents, this session will prove you don't need complex code to build powerful tools.",
    image: '/legacy-images/event 1.jpg',
    hosts: [
      { name: 'Vrijraj Singh', role: 'Head of DevRel, Lamatic.ai' },
      { name: 'Tyrone Tabornal', role: 'Host' },
      { name: 'Aman Sharma', role: 'Host' },
    ],
  },
  {
    title: 'Info Session: Stardust and Strides',
    category: 'Workshop',
    status: 'Finished',
    date: 'September 20, 2025',
    time: '7:00 PM - 9:30 PM',
    venue: 'Teams (Online)',
    description:
      "Join us for Stardust & Strides, the official kickoff event for our new term! This isn't just another info session; it's a launchpad for your future.",
    image: '/legacy-images/host prof/event 2.jpg',
    hosts: [
      { name: 'Karl Michael Dela Cruz', role: 'UX Designer' },
      { name: 'Aldrich Tan', role: 'CXO & Co-Founder' },
      { name: 'Shannen Yu Sapar', role: 'Product Design & Strategy' },
    ],
  },
  {
    title: 'C Workshop for Newbies',
    category: 'Workshop',
    status: 'Finished',
    date: 'December 7, 2024',
    time: '1:00 PM',
    venue: 'Teams (Online)',
    description: 'A beginner-friendly C programming workshop for newbies.',
    image: '/legacy-images/event 3.jfif',
    hosts: [],
  },
  {
    title: 'Game Jam',
    category: 'Workshop',
    status: 'Finished',
    date: 'October 27, 2025',
    time: '01:00 AM',
    venue: 'Online',
    description:
      'A Game Jam is a short event where you or your team work together to create a small game centered around a theme — great for developing new skills and building relationships with fellow game makers.',
    image: '/legacy-images/EVENT2.jpg',
    hosts: [{ name: 'Meansofa', role: 'Host' }],
  },
  {
    title: 'Gemini Study Jam: Gemini Fundamentals',
    category: 'Workshop',
    status: 'Finished',
    date: 'October 18, 2025',
    time: '7:00 PM - 9:00 PM',
    venue: 'Bevvy Virtual (Online)',
    description:
      'Our very first Study Jam! Join Tyrone Tabornal, our Campus Organizer, for Gemini Study Jam: Gemini Fundamentals.',
    image: '/legacy-images/event4.jpg',
    hosts: [{ name: 'Tyrone Tabornal', role: 'Speaker' }],
  },
];

export default function Events() {
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Upcoming Events</span>
        <h2>
          Our <span className="gdg-gradient-text">Events</span>
        </h2>
        <p className="gdg-subtitle">
          Learn, connect, compete, and innovate through workshops, bootcamps,
          hackathons, community meetups, and exciting Google Developer Group
          activities.
        </p>
        <div className="gdg-grid">
          {events.map((event) => (
            <div key={event.title} className="gdg-card">
              <img
                className="gdg-photo"
                src={event.image}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p>
                <span className="gdg-tag">{event.category}</span>{' '}
                <span className="gdg-tag gdg-tag-green">{event.status}</span>
              </p>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="gdg-card-meta">
                <span>{event.date}</span>
                <span>{event.time}</span>
                <span>{event.venue}</span>
              </div>
              {event.hosts.length > 0 && (
                <p>
                  <strong>Hosts: </strong>
                  {event.hosts
                    .map((host) => `${host.name} (${host.role})`)
                    .join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
