import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminShell from './components/admin/AdminShell.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Officers from './pages/Officers.jsx';
import Gallery from './pages/Gallery.jsx';
import Events from './pages/Events.jsx';
import Partners from './pages/Partners.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminEvents from './pages/admin/Events.jsx';
import EventDetail from './pages/admin/EventDetail.jsx';
import AdminTeam from './pages/admin/Team.jsx';
import TeamDetail from './pages/admin/TeamDetail.jsx';
import AdminPartners from './pages/admin/Partners.jsx';
import PartnerDetail from './pages/admin/PartnerDetail.jsx';
import AdminGallery from './pages/admin/Gallery.jsx';
import AlbumDetail from './pages/admin/AlbumDetail.jsx';
import AdminContent from './pages/admin/Content.jsx';
import ContentEditor from './pages/admin/ContentEditor.jsx';
import AdminMedia from './pages/admin/Media.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (CMS-wired per spec v0.4 Home feeds + §5) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Officers />} />
          <Route path="/officers" element={<Navigate to="/team" replace />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login/*" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminShell />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/new" element={<EventDetail />} />
            <Route path="/admin/events/:id" element={<EventDetail />} />
            <Route path="/admin/team" element={<AdminTeam />} />
            <Route path="/admin/team/new" element={<TeamDetail />} />
            <Route path="/admin/team/:id" element={<TeamDetail />} />
            <Route path="/admin/partners" element={<AdminPartners />} />
            <Route path="/admin/partners/new" element={<PartnerDetail />} />
            <Route path="/admin/partners/:id" element={<PartnerDetail />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/gallery/albums/new" element={<AlbumDetail />} />
            <Route path="/admin/gallery/albums/:id" element={<AlbumDetail />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/content/:sectionKey" element={<ContentEditor />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
