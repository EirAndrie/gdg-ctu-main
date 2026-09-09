import { Link } from 'react-router-dom';

const JOIN_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe8XGfS83u5u3bbwqaUlHYmYlTNqPuYPl1aULCb8xMrN91jaQ/viewform?pli=1';

export default function Navbar() {
  return (
    <nav className="gdg-nav">
      <Link to="/" className="gdg-nav-logo">
        <img
          src="/legacy-images/Copy of GDG On Campus.png"
          alt="GDG On Campus Logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </Link>
      <ul className="gdg-nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/officers">Officers</Link>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <a
            href={JOIN_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="gdg-nav-join"
          >
            Join Us
          </a>
        </li>
      </ul>
    </nav>
  );
}
