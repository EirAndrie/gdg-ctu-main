const JOIN_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe8XGfS83u5u3bbwqaUlHYmYlTNqPuYPl1aULCb8xMrN91jaQ/viewform?pli=1';

const FACEBOOK_URL = 'https://www.facebook.com/gdsc.cebutech';

export default function Contact() {
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Contact</span>
        <h2>
          Get in <span className="gdg-gradient-text">Touch</span>
        </h2>
        <p className="gdg-subtitle">
          Have questions or want to collaborate? Reach out to GDG On Campus
          CTU — we would love to hear from you.
        </p>
        <div className="gdg-grid">
          <div className="gdg-card">
            <h3>Join Our Community</h3>
            <p>
              All students of Cebu Technological University are welcome to
              join. Sign up through our registration form.
            </p>
            <div className="gdg-btn-row">
              <a
                href={JOIN_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="gdg-btn gdg-btn-primary"
              >
                Join Us
              </a>
            </div>
          </div>
          <div className="gdg-card">
            <h3>Follow Us</h3>
            <p>
              Stay updated on events, workshops, and announcements through our
              Facebook page.
            </p>
            <div className="gdg-btn-row">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="gdg-btn gdg-btn-secondary"
              >
                Facebook Page
              </a>
            </div>
          </div>
          <div className="gdg-card">
            <h3>Find Us</h3>
            <p>
              Cebu Technological University - Main Campus, M.J. Cuenco Avenue,
              Cebu City, Philippines.
            </p>
            <div className="gdg-btn-row">
              <a
                href="https://maps.google.com/"
                target="_blank"
                rel="noreferrer"
                className="gdg-btn gdg-btn-secondary"
              >
                View Map
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
