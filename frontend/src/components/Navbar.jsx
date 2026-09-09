import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {' | '}
      <Link to="/about">About</Link>
      {' | '}
      <Link to="/officers">Officers</Link>
      {' | '}
      <Link to="/gallery">Gallery</Link>
      {' | '}
      <Link to="/events">Events</Link>
      {' | '}
      <Link to="/contact">Contact</Link>
      {' | '}
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
