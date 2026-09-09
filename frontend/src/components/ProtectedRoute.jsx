import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AdminDisabled() {
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Admin</span>
        <h2>Admin disabled in local dev</h2>
        <p className="gdg-subtitle">
          No Clerk publishable key is set (VITE_CLERK_PUBLISHABLE_KEY). Set
          the key to enable the admin area.
        </p>
      </section>
    </div>
  );
}

export default function ProtectedRoute() {
  if (!clerkPubKey) return <AdminDisabled />;
  return <ProtectedAdminRoutes />;
}

function ProtectedAdminRoutes() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p>Loading…</p>;
  if (!isSignedIn) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
