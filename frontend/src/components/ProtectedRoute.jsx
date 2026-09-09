import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

// TODO: finish full Clerk integration — wrap the app in <ClerkProvider
// publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}> in main.jsx
// (using the SAME Clerk app as the backend), then flesh out the admin login
// page to use Clerk's <SignIn /> component.
export default function ProtectedRoute() {
  let auth = null;
  try {
    auth = useAuth();
  } catch {
    // ClerkProvider is not mounted yet (see TODO above) — allow rendering
    // so the scaffold stays usable until Clerk is wired up.
    return <Outlet />;
  }

  if (!auth.isLoaded) return <p>Loading…</p>;
  if (!auth.isSignedIn) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
