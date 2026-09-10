import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="gdg-footer">
      <div className="gdg-footer-grid">
        <div className="gdg-footer-brand">
          <img
            src="/legacy-images/logo.png"
            alt="GDG CTU Logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h4>Google Developer Groups</h4>
          <p>Cebu Technological University - Main Campus</p>
          <p>
            Building the next generation of developers through technology,
            community, and innovation.
          </p>
          <p>
            <a
              href="https://www.facebook.com/gdsc.cebutech"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/about">About GDG</Link>
            </li>
            <li>
              <Link to="/officers">Our Team</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Developer Resources</h4>
          <ul>
            <li>
              <a href="https://developers.google.com/" target="_blank" rel="noreferrer">
                Google for Developers
              </a>
            </li>
            <li>
              <a href="https://cloud.google.com/" target="_blank" rel="noreferrer">
                Google Cloud
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="https://gdg.community.dev/" target="_blank" rel="noreferrer">
                GDG Program
              </a>
            </li>
            <li>
              <Link to="/contact">Join Our Community</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="gdg-footer-bottom">
        <p>
          &copy; 2026 <strong>Google Developer Groups</strong> - Cebu
          Technological University - Main Campus
        </p>
      </div>
    </footer>
  );
}
