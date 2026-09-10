import { Link } from 'react-router-dom';

const JOIN_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe8XGfS83u5u3bbwqaUlHYmYlTNqPuYPl1aULCb8xMrN91jaQ/viewform?pli=1';

const pillars = [
  {
    title: 'Our Mission',
    text: 'To empower students and the community with cutting-edge technology knowledge through collaborative learning, skill development, and meaningful connections.',
  },
  {
    title: 'Our Vision',
    text: 'A future where every CTU student has access to world-class technology education and a supportive network of tech professionals.',
  },
  {
    title: 'Our Values',
    text: 'Innovation, collaboration, and excellence in an inclusive environment where every member grows into a confident tech professional.',
  },
];

const faqs = [
  {
    question: 'What is GDG On Campus CTU?',
    answer:
      'GDG On Campus CTU is a student-led technology community at Cebu Technological University that empowers aspiring developers through workshops, hackathons, collaborative projects, and networking events powered by Google technologies.',
  },
  {
    question: 'How can I become a member?',
    answer:
      "You can become a member by signing up through our registration form. All students of Cebu Technological University are welcome to join! Just click the 'Join Us' button.",
  },
  {
    question: 'What activities does GDG CTU organize?',
    answer:
      'We organize workshops, hackathons, tech talks, bootcamps, study jams, and community meetups. All activities are designed to help students learn new technologies and build their skills.',
  },
  {
    question: 'What are the benefits of joining?',
    answer:
      'Members get access to exclusive workshops, networking opportunities with industry professionals, project collaboration, Google resources, certificates, and a supportive community of tech enthusiasts.',
  },
  {
    question: 'Do I need to know how to code?',
    answer:
      'Not at all! We welcome everyone regardless of skill level. Our activities are designed for beginners to advanced learners. We believe in learning together and helping each other grow.',
  },
];

export default function Home() {
  return (
    <div className="gdg-container">
      <section className="gdg-section gdg-hero">
        <div>
          <span className="gdg-badge">Welcome to</span>
          <h1>
            Google Developer Groups <span>CTU</span>
          </h1>
          <p>
            A community of passionate developers, designers, innovators, and
            learners from{' '}
            <strong>Cebu Technological University - Main Campus</strong>{' '}
            building technology for everyone.
          </p>
          <div className="gdg-btn-row">
            <Link to="/officers" className="gdg-btn gdg-btn-primary">
              Explore Us
            </Link>
            <Link to="/about" className="gdg-btn gdg-btn-secondary">
              About Us
            </Link>
          </div>
        </div>
        <div>
          <img
            src="/legacy-images/logo.png"
            alt="GDG Logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </section>

      <section className="gdg-section">
        <span className="gdg-badge">Our Purpose</span>
        <h2>
          Building Developers. Creating <span className="gdg-gradient-text">Impact</span>.
        </h2>
        <div className="gdg-grid">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="gdg-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gdg-section">
        <span className="gdg-badge">Questions?</span>
        <h2>
          Frequently Asked <span className="gdg-gradient-text">Questions</span>
        </h2>
        <div className="gdg-faq">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="gdg-section">
        <div className="gdg-cta">
          <h2>Ready to build with us?</h2>
          <p>Join GDG On Campus CTU and start learning with the community.</p>
          <a href={JOIN_FORM_URL} target="_blank" rel="noreferrer">
            Join Us
          </a>
        </div>
      </section>
    </div>
  );
}
